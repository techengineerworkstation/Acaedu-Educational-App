import { supabase } from './supabase'

export interface CourseConstraint {
  id?: string
  course_id: string
  preferred_days: number[]
  preferred_times: string[]
  room_requirements: string
  priority: 'high' | 'medium' | 'low'
  created_at?: string
}

export interface ScheduleSuggestion {
  id?: string
  course_id: string
  suggested_day: number
  suggested_start: string
  suggested_end: string
  suggested_venue_id: string | null
  score: number
  reason: string
  status: 'pending' | 'accepted' | 'rejected'
  created_by?: string
  created_at?: string
  // Joined data
  courses?: { title: string; course_code: string }
  venues?: { name: string }
}

// Check for scheduling conflicts
export async function detectConflicts(
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  excludeScheduleId?: string,
  venueId?: string
): Promise<{ hasConflict: boolean; conflicts: any[] }> {
  let query = supabase
    .from('schedules')
    .select('*, courses(title, course_code), venues(name)')
    .eq('day_of_week', dayOfWeek)
    .eq('is_cancelled', false)
    .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
    .or(`start_time.lt.${endTime},end_time.gt.${startTime}`)

  if (excludeScheduleId) {
    query = query.neq('id', excludeScheduleId)
  }
  if (venueId) {
    query = query.eq('venue_id', venueId)
  }

  const { data: schedules, error } = await query
  if (error) throw error

  // Filter actual overlaps
  const conflicts = (schedules || []).filter(s => {
    return s.start_time < endTime && s.end_time > startTime
  })

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  }
}

// Generate AI suggestions for optimal scheduling
export async function generateSuggestions(_semester?: string): Promise<ScheduleSuggestion[]> {
  // Fetch all courses and their constraints
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)

  if (!courses) return []

  const suggestions: ScheduleSuggestion[] = []

  // Fetch existing schedules
  const { data: existingSchedules } = await supabase
    .from('schedules')
    .select('*')
    .eq('is_cancelled', false)

  // Fetch venues
  const { data: venues } = await supabase
    .from('venues')
    .select('*')

  const usedSlots = new Set<string>()
  existingSchedules?.forEach(s => {
    usedSlots.add(`${s.day_of_week}-${s.start_time}-${s.end_time}`)
  })

  // Available time slots (Mon-Fri, 8am-5pm)
  const timeSlots = [
    { start: '08:00', end: '09:30' },
    { start: '09:30', end: '11:00' },
    { start: '11:00', end: '12:30' },
    { start: '12:30', end: '14:00' },
    { start: '14:00', end: '15:30' },
    { start: '15:30', end: '17:00' },
  ]
  const days = [1, 2, 3, 4, 5] // Mon-Fri

  for (const course of courses) {
    // Fetch constraints for this course
    const { data: constraints } = await supabase
      .from('course_constraints')
      .select('*')
      .eq('course_id', course.id)
      .maybeSingle()

    let bestScore = 0
    let bestSlot: any = null

    for (const day of days) {
      for (const slot of timeSlots) {
        const slotKey = `${day}-${slot.start}-${slot.end}`
        if (usedSlots.has(slotKey)) continue

        let score = 50 // Base score

        // Preferred day bonus
        if (constraints?.preferred_days?.includes(day)) score += 30
        // Preferred time bonus
        if (constraints?.preferred_times?.includes(slot.start)) score += 20
        // Priority bonus
        if (constraints?.priority === 'high') score += 15
        // Prefer mornings (slight bias)
        if (parseInt(slot.start) < 12) score += 5
        // Check venue availability
        let availableVenue = null
        if (venues && venues.length > 0) {
          const venueConflict = await detectConflicts(day, slot.start, slot.end, undefined, undefined)
          if (!venueConflict.hasConflict && venues.length > 0) {
            availableVenue = venues[0]
            score += 10
          }
        }

        if (score > bestScore) {
          bestScore = score
          bestSlot = { day, slot, venue: availableVenue, score, constraints }
        }
      }
    }

    if (bestSlot) {
      suggestions.push({
        course_id: course.id,
        suggested_day: bestSlot.day,
        suggested_start: bestSlot.slot.start,
        suggested_end: bestSlot.slot.end,
        suggested_venue_id: bestSlot.venue?.id || null,
        score: bestSlot.score,
        reason: generateReason(bestSlot),
        status: 'pending',
      })
    }
  }

  // Sort by score descending
  suggestions.sort((a, b) => b.score - a.score)

  // Save suggestions
  for (const suggestion of suggestions) {
    const { error: insertErr } = await supabase.from('ai_scheduler_suggestions').upsert({
      course_id: suggestion.course_id,
      suggested_day: suggestion.suggested_day,
      suggested_start: suggestion.suggested_start,
      suggested_end: suggestion.suggested_end,
      suggested_venue_id: suggestion.suggested_venue_id,
      score: suggestion.score,
      reason: suggestion.reason,
      status: 'pending',
    }, { onConflict: 'course_id' })
    if (insertErr) console.error(insertErr)
  }

  return suggestions
}

function generateReason(slot: any): string {
  const reasons: string[] = []
  if (slot.constraints?.preferred_days?.includes(slot.day)) {
    reasons.push('Matches preferred day')
  }
  if (slot.constraints?.preferred_times?.includes(slot.slot.start)) {
    reasons.push('Matches preferred time')
  }
  if (slot.constraints?.priority === 'high') {
    reasons.push('High priority course')
  }
  if (slot.venue) {
    reasons.push(`Available venue: ${slot.venue.name}`)
  }
  return reasons.join('; ') || 'Optimal scheduling slot'
}

// Accept a suggestion (create the actual schedule)
export async function acceptSuggestion(suggestionId: string, createdBy: string) {
  const { data: suggestion, error: fetchError } = await supabase
    .from('ai_scheduler_suggestions')
    .select('*')
    .eq('id', suggestionId)
    .single()
  if (fetchError || !suggestion) throw new Error('Suggestion not found')

  // Check for conflicts
  const { hasConflict, conflicts } = await detectConflicts(
    suggestion.suggested_day,
    suggestion.suggested_start,
    suggestion.suggested_end,
    undefined,
    suggestion.suggested_venue_id
  )
  if (hasConflict) {
    throw new Error(`Schedule conflict detected: ${conflicts.map(c => c.courses?.title).join(', ')}`)
  }

  // Create the schedule
  const { error: insertError } = await supabase.from('schedules').insert({
    course_id: suggestion.course_id,
    day_of_week: suggestion.suggested_day,
    start_time: suggestion.suggested_start,
    end_time: suggestion.suggested_end,
    venue_id: suggestion.suggested_venue_id,
    created_by: createdBy,
  })
  if (insertError) throw insertError

  // Update suggestion status
  await supabase
    .from('ai_scheduler_suggestions')
    .update({ status: 'accepted' })
    .eq('id', suggestionId)
}

// Reject a suggestion
export async function rejectSuggestion(suggestionId: string) {
  await supabase
    .from('ai_scheduler_suggestions')
    .update({ status: 'rejected' })
    .eq('id', suggestionId)
}

// Get all suggestions
export async function getSuggestions() {
  const { data, error } = await supabase
    .from('ai_scheduler_suggestions')
    .select('*, courses(title, course_code), venues(name)')
    .order('score', { ascending: false })
  if (error) throw error
  return data || []
}
