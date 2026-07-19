import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from './supabase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export async function registerForPushNotifications(userId: string): Promise<string | null> {
  if (!Device.isDevice) return null

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') return null

  const token = (await Notifications.getExpoPushTokenAsync()).data

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#c1272d',
    })
  }

  await supabase.from('notifications').insert({
    user_id: userId,
    title: 'Push notifications enabled',
    body: 'You will receive push notifications for class updates, announcements, and more.',
    notification_type: 'general',
    color_tag: 'teal',
  }).catch(console.error)

  return token
}

export function setupNotificationListeners(
  onNotificationReceived: (notification: Notifications.Notification) => void,
  onNotificationTapped: (response: Notifications.NotificationResponse) => void
) {
  const receivedSub = Notifications.addNotificationReceivedListener(onNotificationReceived)
  const responseSub = Notifications.addNotificationResponseReceivedListener(onNotificationTapped)
  return () => {
    receivedSub.remove()
    responseSub.remove()
  }
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true, priority: Notifications.AndroidNotificationPriority.MAX },
    trigger,
  })
}
