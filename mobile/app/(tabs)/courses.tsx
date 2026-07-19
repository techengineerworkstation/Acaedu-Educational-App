import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { colors, spacing, borderRadius } from '../../lib/theme'

export default function CoursesScreen() {
  const [courses, setCourses] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data } = await supabase
      .from('enrollments')
      .select('*, subjects(*)')
      .eq('student_id', session.user.id)
      .order('created_at', { ascending: false })

    setCourses(data || [])
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadCourses()
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Subjects</Text>
        <Text style={styles.headerSubtitle}>Your enrolled courses</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Ionicons name="book-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>Loading subjects...</Text>
        </View>
      ) : courses.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="book-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No subjects enrolled yet</Text>
          <Text style={styles.emptySubtext}>Subjects will appear here once you are enrolled</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.courseCard} activeOpacity={0.7}>
              <View style={[styles.courseIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="book" size={24} color={colors.primary} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{item.subjects?.name || 'Unknown Subject'}</Text>
                <Text style={styles.courseCode}>{item.subjects?.code || ''}</Text>
                <Text style={styles.courseTeacher}>Instructor: {item.subjects?.teacher_name || 'TBA'}</Text>
              </View>
              <View style={styles.courseGrade}>
                <Text style={styles.gradeText}>{item.grade || 'N/A'}</Text>
                <Text style={styles.gradeLabel}>Grade</Text>
              </View>
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
  list: { padding: spacing.lg, gap: spacing.md },
  courseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.lg },
  courseIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  courseInfo: { flex: 1, marginLeft: spacing.md },
  courseName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  courseCode: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  courseTeacher: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  courseGrade: { alignItems: 'center' },
  gradeText: { color: colors.gold, fontSize: 18, fontWeight: '800' },
  gradeLabel: { color: colors.textMuted, fontSize: 10 },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: spacing.md },
  emptySubtext: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs, textAlign: 'center' },
})
