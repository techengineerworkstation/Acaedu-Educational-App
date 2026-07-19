import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { colors, spacing, borderRadius } from '../../lib/theme'

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    setNotifications(data || [])
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadNotifications()
    setRefreshing(false)
  }

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'grade': return 'school'
      case 'attendance': return 'checkmark-circle'
      case 'assignment': return 'document-text'
      case 'payment': return 'card'
      case 'event': return 'calendar'
      default: return 'notifications'
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>{notifications.filter(n => !n.read).length} unread</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Ionicons name="notifications-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="notifications-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notifCard, !item.read && styles.unreadCard]}
              activeOpacity={0.7}
              onPress={() => markAsRead(item.id)}
            >
              <View style={[styles.notifIcon, { backgroundColor: (item.color_tag === 'red' ? colors.primary : colors.secondary) + '20' }]}>
                <Ionicons name={getIcon(item.notification_type) as any} size={20} color={item.color_tag === 'red' ? colors.primary : colors.secondary} />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifBody} numberOfLines={3}>{item.body}</Text>
                <Text style={styles.notifTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.lg },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  list: { padding: spacing.lg, gap: spacing.sm },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.md },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  notifIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1, marginLeft: spacing.md },
  notifTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  notifBody: { color: colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 },
  notifTime: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: spacing.xs },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: spacing.md },
  emptySubtext: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
})
