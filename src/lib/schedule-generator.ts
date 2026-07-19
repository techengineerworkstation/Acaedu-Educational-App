import { supabase } from './supabase'

export interface ScheduleInstance {
  id?: string
  schedule_id: string
  instance_date: string
  start_time: string
  end_time: string
  is_cancelled: boolean
  cancel_reason: string | null
  notes: string | null
  created_at?: string
}

// Generate instances for a recurring schedule over a date range
export async function generateScheduleInstances(
  scheduleId: string,
  startDate: string,
  endDate: string
): Promise<ScheduleInstance[]> {
  // Fetch the base schedule
  const { data: schedule, error: schedError } = await supabase
    .from('schedules')
    .select('*, courses(title, course_code), venues(name)')
    .eq('id', scheduleId)
    .single()
  if (schedError || !schedule) throw new Error('Schedule not found')

  const instances: ScheduleInstance[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Find all matching days of week in the range
  const current = new Date(start)
  while (current <= end) {
    const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay() // Convert Sunday=0 to 7
    if (dayOfWeek === schedule.day_of_week) {
      const dateStr = current.toISOString().split('T')[0]
      instances.push({
        schedule_id: scheduleId,
        instance_date: dateStr,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_cancelled: schedule.is_cancelled || false,
        cancel_reason: schedule.cancel_reason || null,
        notes: null,
      })
    }
    current.setDate(current.getDate() + 1)
  }

  // Upsert instances (avoid duplicates)
  if (instances.length > 0) {
    const { data, error } = await supabase
      .from('schedule_instances')
      .upsert(instances, { onConflict: 'schedule_id,instance_date', ignoreDuplicates: true })
      .select()
    if (error) throw error
    return data || []
  }
  return []
}

// Generate instances for all active schedules
export async function generateAllInstances(startDate: string, endDate: string) {
  const { data: schedules, error } = await supabase
    .from('schedules')
    .select('id')
    .eq('is_cancelled', false)
  if (error) throw error
  if (!schedules) return

  for (const schedule of schedules) {
    await generateScheduleInstances(schedule.id, startDate, endDate)
  }
}

// Get instances for a specific date range
export async function getScheduleInstances(startDate: string, endDate: string, userId?: string) {
  let query = supabase
    .from('schedule_instances')
    .select('*, schedules(*, courses(title, course_code, lecturer_id), venues(name, building, directions))')
    .gte('instance_date', startDate)
    .lte('instance_date', endDate)
    .order('instance_date')
    .order('start_time')

  if (userId) {
    query = query.eq('schedules.lecturer_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

// Cancel a single instance
export async function cancelInstance(instanceId: string, reason: string) {
  const { error } = await supabase
    .from('schedule_instances')
    .update({ is_cancelled: true, cancel_reason: reason })
    .eq('id', instanceId)
  if (error) throw error
}
