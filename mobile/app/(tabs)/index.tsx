import { useEffect, useState, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useMobileTheme } from '../../lib/theme'

export default function HomeScreen() {
  const { tokens } = useMobileTheme()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: tokens.spacing.lg },
    greeting: { color: '#fff', fontSize: 22, fontWeight: '800' },
    role: { color: tokens.colors.textMuted, fontSize: 13, marginTop: 2 },
    logoSmall: { width: 40, height: 40, borderRadius: 12, backgroundColor: tokens.colors.primary, justifyContent: 'center', alignItems: 'center' },
    logoText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    statsRow: { flexDirection: 'row', paddingHorizontal: tokens.spacing.lg, gap: tokens.spacing.sm },
    statCard: { flex: 1, backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, padding: tokens.spacing.md, borderLeftWidth: 3 },
    statValue: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: tokens.spacing.xs },
    statLabel: { color: tokens.colors.textMuted, fontSize: 11 },
    section: { padding: tokens.spacing.lg },
    sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: tokens.spacing.md },
    emptyText: { color: tokens.colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: tokens.spacing.xl },
    notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, padding: tokens.spacing.md, marginBottom: tokens.spacing.sm },
    notifTitle: { color: '#fff', fontSize: 13, fontWeight: '600' },
    notifBody: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 2 },
    notifDot: { width: 8, height: 8, borderRadius: 4 },
    annCard: { backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, padding: tokens.spacing.md, marginBottom: tokens.spacing.sm },
    annTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
    annContent: { color: tokens.colors.textMuted, fontSize: 12, marginTop: tokens.spacing.xs, lineHeight: 18 },
    annMeta: { flexDirection: 'row', marginTop: tokens.spacing.sm },
    priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    priorityText: { fontSize: 10, fontWeight: '700' },
  }), [tokens])

  useEffect(() => { loadData() }, [])

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

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false) }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.primary} />}>
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Hello, {profile?.full_name?.split(' ')[0] || 'Student'} 👋</Text>
            <Text style={s.role}>{profile?.role?.charAt(0).toUpperCase() + (profile?.role?.slice(1) || 'Student')}</Text>
          </View>
          <View style={s.logoSmall}>
            <Text style={s.logoText}>A</Text>
          </View>
        </View>

        <View style={s.statsRow}>
          {[
            { icon: 'book', label: 'Subjects', value: '6', color: tokens.colors.primary },
            { icon: 'checkmark-circle', label: 'Attendance', value: '92%', color: tokens.colors.success },
            { icon: 'star', label: 'GPA', value: '3.8', color: tokens.colors.gold },
          ].map((stat, i) => (
            <View key={i} style={[s.statCard, { borderLeftColor: stat.color }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Recent Notifications</Text>
          {notifications.length === 0 ? (
            <Text style={s.emptyText}>No notifications yet</Text>
          ) : notifications.map((n, i) => (
            <View key={i} style={s.notifCard}>
              <Ionicons name="notifications" size={16} color={tokens.colors.info} />
              <View style={{ flex: 1, marginLeft: tokens.spacing.sm }}>
                <Text style={s.notifTitle}>{n.title}</Text>
                <Text style={s.notifBody} numberOfLines={2}>{n.body}</Text>
              </View>
              <View style={[s.notifDot, { backgroundColor: n.read ? 'transparent' : tokens.colors.primary }]} />
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Announcements</Text>
          {announcements.length === 0 ? (
            <Text style={s.emptyText}>No announcements</Text>
          ) : announcements.map((a, i) => (
            <View key={i} style={s.annCard}>
              <Text style={s.annTitle}>{a.title}</Text>
              <Text style={s.annContent} numberOfLines={3}>{a.content}</Text>
              <View style={s.annMeta}>
                <View style={[s.priorityBadge, { backgroundColor: a.priority === 'urgent' ? tokens.colors.danger + '20' : a.priority === 'high' ? tokens.colors.warning + '20' : tokens.colors.info + '20' }]}>
                  <Text style={[s.priorityText, { color: a.priority === 'urgent' ? tokens.colors.danger : a.priority === 'high' ? tokens.colors.warning : tokens.colors.info }]}>
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
