import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { colors, spacing, borderRadius } from '../../lib/theme'

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    setUser(session.user)

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    setProfile(prof)

    const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5)
    setNotifications(notifs || [])

    const { data: anns } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5)
    setAnnouncements(anns || [])
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile?.full_name?.split(' ')[0] || 'Student'} 👋</Text>
            <Text style={styles.role}>{profile?.role?.charAt(0).toUpperCase() + (profile?.role?.slice(1) || 'Student')}</Text>
          </View>
          <View style={styles.logoSmall}>
            <Text style={styles.logoText}>A</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { icon: 'book', label: 'Subjects', value: '6', color: colors.primary },
            { icon: 'checkmark-circle', label: 'Attendance', value: '92%', color: colors.success },
            { icon: 'star', label: 'GPA', value: '3.8', color: colors.gold },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications yet</Text>
          ) : notifications.map((n, i) => (
            <View key={i} style={styles.notifCard}>
              <Ionicons name="notifications" size={16} color={colors.info} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifBody} numberOfLines={2}>{n.body}</Text>
              </View>
              <View style={[styles.notifDot, { backgroundColor: n.read ? 'transparent' : colors.primary }]} />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          {announcements.length === 0 ? (
            <Text style={styles.emptyText}>No announcements</Text>
          ) : announcements.map((a, i) => (
            <View key={i} style={styles.annCard}>
              <Text style={styles.annTitle}>{a.title}</Text>
              <Text style={styles.annContent} numberOfLines={3}>{a.content}</Text>
              <View style={styles.annMeta}>
                <View style={[styles.priorityBadge, { backgroundColor: a.priority === 'urgent' ? colors.danger + '20' : a.priority === 'high' ? colors.warning + '20' : colors.info + '20' }]}>
                  <Text style={[styles.priorityText, { color: a.priority === 'urgent' ? colors.danger : a.priority === 'high' ? colors.warning : colors.info }]}>
                    {a.priority?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  greeting: { color: '#fff', fontSize: 22, fontWeight: '800' },
  role: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  logoSmall: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm },
  statCard: { flex: 1, backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.md, borderLeftWidth: 3 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: spacing.xs },
  statLabel: { color: colors.textMuted, fontSize: 11 },
  section: { padding: spacing.lg },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: spacing.xl },
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  notifTitle: { color: '#fff', fontSize: 13, fontWeight: '600' },
  notifBody: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  notifDot: { width: 8, height: 8, borderRadius: 4 },
  annCard: { backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  annTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  annContent: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs, lineHeight: 18 },
  annMeta: { flexDirection: 'row', marginTop: spacing.sm },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '700' },
})
