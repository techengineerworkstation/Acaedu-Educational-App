import { useEffect, useState } from 'react'
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { colors, spacing, borderRadius } from '../../lib/theme'

export default function ScheduleScreen() {
  const [schedule, setSchedule] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data } = await supabase
      .from('schedules')
      .select('*, subjects(*)')
      .eq('student_id', session.user.id)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    setSchedule(data || [])
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadSchedule()
    setRefreshing(false)
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <Text style={styles.headerSubtitle}>Your weekly class timetable</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>Loading schedule...</Text>
        </View>
      ) : schedule.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No classes scheduled</Text>
          <Text style={styles.emptySubtext}>Your timetable will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={days}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item: day }) => {
            const dayClasses = schedule.filter(s => s.day_of_week?.toLowerCase() === day.toLowerCase())
            if (dayClasses.length === 0) return null
            return (
              <View style={styles.daySection}>
                <Text style={styles.dayTitle}>{day}</Text>
                {dayClasses.map((cls, i) => (
                  <View key={i} style={styles.classCard}>
                    <View style={styles.timeColumn}>
                      <Text style={styles.timeText}>{formatTime(cls.start_time)}</Text>
                      <View style={styles.timeDivider} />
                      <Text style={styles.timeText}>{formatTime(cls.end_time)}</Text>
                    </View>
                    <View style={styles.classInfo}>
                      <Text style={styles.className}>{cls.subjects?.name || 'Class'}</Text>
                      <Text style={styles.classRoom}>{cls.room || 'Room TBA'}</Text>
                      <Text style={styles.classTeacher}>{cls.subjects?.teacher_name || ''}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.lg },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  list: { padding: spacing.lg },
  daySection: { marginBottom: spacing.xl },
  dayTitle: { color: colors.primary, fontSize: 14, fontWeight: '700', marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  classCard: { flexDirection: 'row', backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  timeColumn: { alignItems: 'center', width: 60 },
  timeText: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  timeDivider: { height: 1, width: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  classInfo: { flex: 1, marginLeft: spacing.md },
  className: { color: '#fff', fontSize: 15, fontWeight: '700' },
  classRoom: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  classTeacher: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: spacing.md },
  emptySubtext: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
})
