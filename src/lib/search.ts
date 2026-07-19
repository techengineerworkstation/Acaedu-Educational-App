import { supabase } from './supabase'

export interface SearchResult {
  table: string
  id: string
  title: string
  description: string
  url: string
  relevance: number
}

export async function globalSearch(
  query: string,
  userId?: string,
  tables: string[] = ['courses', 'announcements', 'events', 'videos', 'course_materials']
): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  // Log search query
  if (userId) {
    await supabase.from('search_queries').insert({
      user_id: userId,
      query,
      results_count: 0,
    })
  }

  const results: SearchResult[] = []
  const term = query.toLowerCase()

  // Search courses
  if (tables.includes('courses')) {
    const { data } = await supabase
      .from('courses')
      .select('id, course_code, title, description')
      .or(`title.ilike.%${term}%,course_code.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(10)
    if (data) {
      results.push(...data.map(c => ({
        table: 'courses',
        id: c.id,
        title: `${c.course_code} - ${c.title}`,
        description: c.description || '',
        url: `/courses`,
        relevance: c.title.toLowerCase().includes(term) ? 10 : 5,
      })))
    }
  }

  // Search announcements
  if (tables.includes('announcements')) {
    const { data } = await supabase
      .from('announcements')
      .select('id, title, content, priority')
      .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
      .limit(10)
    if (data) {
      results.push(...data.map(a => ({
        table: 'announcements',
        id: a.id,
        title: a.title,
        description: a.content?.substring(0, 200) || '',
        url: '/announcements',
        relevance: a.priority === 'urgent' ? 10 : a.priority === 'high' ? 8 : 5,
      })))
    }
  }

  // Search events
  if (tables.includes('events')) {
    const { data } = await supabase
      .from('events')
      .select('id, title, description, event_date')
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(10)
    if (data) {
      results.push(...data.map(e => ({
        table: 'events',
        id: e.id,
        title: e.title,
        description: e.description || '',
        url: '/events',
        relevance: 5,
      })))
    }
  }

  // Search videos
  if (tables.includes('videos')) {
    const { data } = await supabase
      .from('videos')
      .select('id, title, description')
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(10)
    if (data) {
      results.push(...data.map(v => ({
        table: 'videos',
        id: v.id,
        title: v.title,
        description: v.description || '',
        url: '/videos',
        relevance: 5,
      })))
    }
  }

  // Search course materials
  if (tables.includes('course_materials')) {
    const { data } = await supabase
      .from('course_materials')
      .select('id, title, description')
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(10)
    if (data) {
      results.push(...data.map(m => ({
        table: 'course_materials',
        id: m.id,
        title: m.title,
        description: m.description || '',
        url: '/course-materials',
        relevance: 5,
      })))
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance)

  // Update search count
  if (userId && results.length > 0) {
    await supabase
      .from('search_queries')
      .update({ results_count: results.length })
      .eq('user_id', userId)
      .eq('query', query)
      .eq('results_count', 0)
  }

  return results
}
