import { supabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Channel management
const channels = new Map<string, RealtimeChannel>()

export function subscribeToTable(
  table: string,
  callback: (payload: { eventType: string; new: any; old: any }) => void,
  filter?: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'; schema?: string; filter?: string }
) {
  const channelName = `realtime:${table}:${filter?.filter || 'all'}`
  
  if (channels.has(channelName)) {
    channels.get(channelName)!.unsubscribe()
  }

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: filter?.event || '*',
        schema: filter?.schema || 'public',
        table,
        filter: filter?.filter,
      },
      callback
    )
    .subscribe()

  channels.set(channelName, channel)
  return () => {
    channel.unsubscribe()
    channels.delete(channelName)
  }
}

export function subscribeToUserNotifications(userId: string, callback: (notification: any) => void) {
  return subscribeToTable('notifications', (payload) => {
    if (payload.eventType === 'INSERT') {
      callback(payload.new)
    }
  }, { event: 'INSERT', filter: `user_id=eq.${userId}` })
}

export function subscribeToCourseAnnouncements(courseId: string, callback: (announcement: any) => void) {
  return subscribeToTable('announcements', (payload) => {
    if (payload.eventType === 'INSERT') {
      callback(payload.new)
    }
  }, { event: 'INSERT', filter: `course_id=eq.${courseId}` })
}

export function subscribeToScheduleChanges(callback: (schedule: any) => void) {
  return subscribeToTable('schedules', (payload) => {
    callback(payload.new)
  }, { event: '*' })
}

export function subscribeToAttendance(courseId: string, callback: (record: any) => void) {
  return subscribeToTable('attendance', (payload) => {
    callback(payload.new)
  }, { event: '*', filter: `course_id=eq.${courseId}` })
}

export function unsubscribeAll() {
  channels.forEach((channel) => channel.unsubscribe())
  channels.clear()
}
