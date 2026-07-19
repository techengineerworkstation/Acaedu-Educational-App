import { useEffect, useState, useMemo } from 'react'
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useMobileTheme } from '../../lib/theme'

export default function ScheduleScreen() {
  const { tokens } = useMobileTheme()
  const [schedule, setSchedule] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    header: { padding: tokens.spacing.lg },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
    headerSubtitle: { color: tokens.colors.textMuted, fontSize: 13, marginTop: 2 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.xl },
    list: { padding: tokens.spacing.lg },
    daySection: { marginBottom: tokens.spacing.xl },
    dayTitle: { color: tokens.colors.primary, fontSize: 14, fontWeight: '700', marginBottom: tokens.spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
    classCard: { flexDirection: 'row', backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, padding: tokens.spacing.md, marginBottom: tokens.spacing.sm },
    timeColumn: { alignItems: 'center', width: 60 },
    timeText: { color: tokens.colors.textMuted, fontSize: 11, fontWeight: '600' },
    timeDivider: { height: 1, width: 1, backgroundColor: tokens.colors.border, marginVertical: tokens.spacing.xs },
    classInfo: { flex: 1, marginLeft: tokens.spacing.md },
    className: { color: '#fff', fontSize: 15, fontWeight: '700' },
    classRoom: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 2 },
    classTeacher: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 2 },
    emptyText: { color: tokens.colors.textMuted, fontSize: 14, marginTop: tokens.spacing.md },
    emptySubtext: { color: tokens.colors.textMuted, fontSize: 12, marginTop: tokens.spacing.xs },
  }), [tokens])

  useEffect(() => { loadSchedule() }, [])

  const loadSchedule = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { data } = await supabase.from('schedules').select('*, subjects(*)').eq('student_id', session.user.id).order('day_of_week', { ascending: true }).order('start_time', { ascending: true })
    setSchedule(data || [])
    setLoading(false)
  }

  const onRefresh = async () => { setRefreshing(true); await loadSchedule(); setRefreshing(false) }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Schedule</Text>
        <Text style={s.headerSubtitle}>Your weekly class timetable</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <Ionicons name="calendar-outline" size={48} color={tokens.colors.textMuted} />
          <Text style={s.emptyText}>Loading schedule...</Text>
        </View>
      ) : schedule.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="calendar-outline" size={48} color={tokens.colors.textMuted} />
          <Text style={s.emptyText}>No classes scheduled</Text>
          <Text style={s.emptySubtext}>Your timetable will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={days}
          keyExtractor={(item) => item}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.primary} />}
          renderItem={({ item: day }) => {
            const dayClasses = schedule.filter(sc => sc.day_of_week?.toLowerCase() === day.toLowerCase())
            if (dayClasses.length === 0) return null
            return (
              <View style={s.daySection}>
                <Text style={s.dayTitle}>{day}</Text>
                {dayClasses.map((cls, i) => (
                  <View key={i} style={s.classCard}>
                    <View style={s.timeColumn}>
                      <Text style={s.timeText}>{formatTime(cls.start_time)}</Text>
                      <View style={s.timeDivider} />
                      <Text style={s.timeText}>{formatTime(cls.end_time)}</Text>
                    </View>
                    <View style={s.classInfo}>
                      <Text style={s.className}>{cls.subjects?.name || 'Class'}</Text>
                      <Text style={s.classRoom}>{cls.room || 'Room TBA'}</Text>
                      <Text style={s.classTeacher}>{cls.subjects?.teacher_name || ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}
