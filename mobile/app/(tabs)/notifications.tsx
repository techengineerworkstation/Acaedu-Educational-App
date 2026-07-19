import { useEffect, useState, useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useMobileTheme } from '../../lib/theme'

export default function NotificationsScreen() {
  const { tokens } = useMobileTheme()
  const [notifications, setNotifications] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    header: { padding: tokens.spacing.lg },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
    headerSubtitle: { color: tokens.colors.textMuted, fontSize: 13, marginTop: 2 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.xl },
    list: { padding: tokens.spacing.lg, gap: tokens.spacing.sm },
    notifCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, padding: tokens.spacing.md },
    unreadCard: { borderLeftWidth: 3, borderLeftColor: tokens.colors.primary },
    notifIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    notifContent: { flex: 1, marginLeft: tokens.spacing.md },
    notifTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
    notifBody: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 },
    notifTime: { color: tokens.colors.textMuted, fontSize: 11, marginTop: 6 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: tokens.colors.primary, marginTop: tokens.spacing.xs },
    emptyText: { color: tokens.colors.textMuted, fontSize: 14, marginTop: tokens.spacing.md },
    emptySubtext: { color: tokens.colors.textMuted, fontSize: 12, marginTop: tokens.spacing.xs },
  }), [tokens])

  useEffect(() => { loadNotifications() }, [])

  const loadNotifications = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { data } = await supabase.from('notifications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    setNotifications(data || [])
    setLoading(false)
  }

  const onRefresh = async () => { setRefreshing(true); await loadNotifications(); setRefreshing(false) }

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
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Notifications</Text>
        <Text style={s.headerSubtitle}>{notifications.filter(n => !n.read).length} unread</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <Ionicons name="notifications-outline" size={48} color={tokens.colors.textMuted} />
          <Text style={s.emptyText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="notifications-outline" size={48} color={tokens.colors.textMuted} />
          <Text style={s.emptyText}>No notifications</Text>
          <Text style={s.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.primary} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.notifCard, !item.read && s.unreadCard]}
              activeOpacity={0.7}
              onPress={() => markAsRead(item.id)}
            >
              <View style={[s.notifIcon, { backgroundColor: (item.color_tag === 'red' ? tokens.colors.primary : tokens.colors.secondary) + '20' }]}>
                <Ionicons name={getIcon(item.notification_type) as any} size={20} color={item.color_tag === 'red' ? tokens.colors.primary : tokens.colors.secondary} />
              </View>
              <View style={s.notifContent}>
                <Text style={s.notifTitle}>{item.title}</Text>
                <Text style={s.notifBody} numberOfLines={3}>{item.body}</Text>
                <Text style={s.notifTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              {!item.read && <View style={s.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}
