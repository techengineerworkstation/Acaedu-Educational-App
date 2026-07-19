import { supabase } from './supabase'
import { subscribeToUserNotifications } from './realtime'

let cleanupFn: (() => void) | null = null

// Request browser notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

// Show browser notification
function showBrowserNotification(title: string, body: string, _color?: string) {
  if (Notification.permission !== 'granted') return
  const notification = new Notification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'acaedu-' + Date.now(),
    requireInteraction: false,
  })
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

// Play notification sound
function playNotificationSound() {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczIj2NysijaTkmS5zO1rFtPytGk8fWsnBCKEaPytaycUIpR5PH1rJxQihGj8nWs3FCKUeTx9eyckMqSJPJ2LRzRCtJlMnYtXRFLEmVytq2dUYuSpbL3Ld3Ry9Ll83duHlIMUyZzt65e0oyTZrP4Lp8SzRNm9Diu35MNU6c0uO8f002T53T5L2ATTdQntXlvoFOOFGf1+bBgk85U6DY6MSCUTpUodnqxYNSO1Wi2+zGhFI8VqPc7ciGUzxXpN3uy4hVPVil3/DNilY+W6fh886MV0BbqeP10I1YQV2q5PbSj1pCX6vm+NOPW0Ngrev51ZBcRGBv7PrXkV1FYXHt/NeSXkZicu/+2pNfR2Nz8P7clWFIY3Tz/tuWYklkdff+3pdjSmV2+f/gmWVLZnj7/+KbZ0xnef3/5J1pTWl7//7mnmlOan4A/+afa09rfgL/56BtUGx/A//ooW9RbYAE/+mib1JugQX/66NwU2+CBv/so3FUcIQH/+2kc1VxhQj/7qV0VnOGCP/vpnVXc4cK/+Cod1h0iAr/4al4WXWJDP/jqnlbdooM/+Wselx3iw3/5657XXmMDv/psH1feo0P/+qyfmB7jhD/7LR/YnyPEf/ttYBkfZAS/++2gmV9kRL/8LeDZn6SE//xuIRnf5MU//K5hWh/lBX/87qGaX+VF//1u4dpf5cY//a8h2p/lxn/972Ia3+YGv/4vohsf5gb//m/iW1/mBv/+r+Kbn+YHP/7wItvf5gc//vAi29/mB3//MCMcH+YHf/8wYxwf5ge//3BjXB/mB7//cKNcX+YH//+wo1yf5gg//7CjnJ/mCD//8OOwn+YIf//w47Df5gi///Ej8N/mCL//8WQxH+YI///xpHEf5gk///HksV/mCT//8iTxn+YJP//yJTGf5gl///JlMZ/mCX//8qVx3+YJv//y5bHf5gm///Ml8d/mCb//82Yx3+YJ///zpjHf5gn///Pmch/mCf//9CayH+YJ///0ZrJf5go///Sm8l/mCj//9ObyX+YKP//1JzJf5gp///Vncl/mCn//9adyX+YKf//153Kf5gp///Ynsp/mCn//9ieyn+YKv//2Z7Kf5gq///an8p/mCr//9qfyn+YK///26DKf5gq///bn8p/mCv//9ugyn+YK///3KDKf5gr///coMp/mCv//9ygun+YK///3aG6f5gr///dobl/mCv//96hun+YK///36K6f5gr///fobp/mCv//9+imn+YK///4KKaf5gr///gopp/mCv//+Cimn+YK///4aKaf5gr///hopp/mCv//+Kimn+YK///4qKaf5gr///jopp/mCv//+Oimn+YK///5KKaf5gr///kopp/mCv//+Simn+YK///5aKaf5gr///lopp/mCv//+aimn+YK///56Kaf5gr///oopp/mCv//+iimn+YK///6KKaf5gr///popp/mCv//+mimn+YK///6aKaf5gr///qopp/mCv//+qimn+YK///66Kaf5gr///rppp/mCv//+yimn+YK///7KKaf5gr///sppp/mCv//+yimn+YK///7aKaf5gr///topp/mCv//+yimn+YK///7qKaf5gr///tppp/mCv//+yimn+YK///8KKaf5gr///uJpp/mCv//+yimn+YK///8aKaf5gr///vJpp/mCv//+yimn+YK///8qKaf5gr///wJpp/mCv//+yimn+YK///9KKaf5gr///xJpp/mCv//+yimn+YK///9aKaf5gr///yJpp/mCv//+yimn+YK///9qKaf5gr///zJpp/mCv//+yimn+YK///+CKaf5gr///0Jpp/mCv//+yimn+YK///+KKaf5gr///1Jpp/mCv//+yimn+YK///+SKaf5gr///2Jpp/mCv//+yimn+YK///+aKaf5gr///3Jpp/mCv//+yimn+YK///+qKaf5gr///4Jpp/mCv//+yimn+YK///+yKaf5gr///5Jpp/mCv//+yimn+YK////CKaf5gr///6Jpp/mCv//+yimn+YK////KKaf5gr///7Jpp/mCv//+yimn+YK////SKaf5gr///8Jpp/mCv//+yimn+YK////aKaf5gr///9Jpp/mCv//+yimn+YK////qKaf5gr///+Jpp/mCv//+yimn+YK///')
    audio.volume = 0.3
    audio.play().catch(() => {})
  } catch (_e) { /* ignore */ }
}

// Color mapping for notification types
const colorMap: Record<string, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  teal: '#14b8a6',
  general: '#3b82f6',
  urgent: '#ef4444',
  exam: '#a855f7',
  event: '#22c55e',
}

// Initialize real-time notifications for a user
export function initNotifications(userId: string) {
  requestNotificationPermission()
  
  cleanupFn = subscribeToUserNotifications(userId, (notification) => {
    showBrowserNotification(
      notification.title,
      notification.body,
      colorMap[notification.color_tag] || colorMap[notification.notification_type]
    )
    playNotificationSound()
    
    // Dispatch custom event for in-app notification toast
    window.dispatchEvent(new CustomEvent('acaedu:notification', {
      detail: notification
    }))
  })
}

// Cleanup
export function cleanupNotifications() {
  if (cleanupFn) {
    cleanupFn()
    cleanupFn = null
  }
}

// Fetch notifications for a user
export async function fetchNotifications(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// Mark notification as read
export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
  if (error) throw error
}

// Mark all as read
export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
  if (error) throw error
}

// Create a notification
export async function createNotification(data: {
  user_id: string
  title: string
  body: string
  notification_type?: string
  color_tag?: string
  reference_id?: string
  created_by?: string
}) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      ...data,
      notification_type: data.notification_type || 'general',
      color_tag: data.color_tag || colorMap[data.notification_type || 'general'] ? data.notification_type || 'general' : 'blue',
    })
  if (error) throw error
}

// Get unread count
export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)
  if (error) return 0
  return count || 0
}
