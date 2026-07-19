import { useEffect, useState, useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useMobileTheme } from '../../lib/theme'

export default function CoursesScreen() {
  const { tokens } = useMobileTheme()
  const [courses, setCourses] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    header: { padding: tokens.spacing.lg },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
    headerSubtitle: { color: tokens.colors.textMuted, fontSize: 13, marginTop: 2 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.xl },
    list: { padding: tokens.spacing.lg, gap: tokens.spacing.md },
    courseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, padding: tokens.spacing.lg },
    courseIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    courseInfo: { flex: 1, marginLeft: tokens.spacing.md },
    courseName: { color: '#fff', fontSize: 15, fontWeight: '700' },
    courseCode: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 2 },
    courseTeacher: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 4 },
    courseGrade: { alignItems: 'center' },
    gradeText: { color: tokens.colors.gold, fontSize: 18, fontWeight: '800' },
    gradeLabel: { color: tokens.colors.textMuted, fontSize: 10 },
    emptyText: { color: tokens.colors.textMuted, fontSize: 14, marginTop: tokens.spacing.md },
    emptySubtext: { color: tokens.colors.textMuted, fontSize: 12, marginTop: tokens.spacing.xs, textAlign: 'center' },
  }), [tokens])

  useEffect(() => { loadCourses() }, [])

  const loadCourses = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { data } = await supabase.from('enrollments').select('*, subjects(*)').eq('student_id', session.user.id).order('created_at', { ascending: false })
    setCourses(data || [])
    setLoading(false)
  }

  const onRefresh = async () => { setRefreshing(true); await loadCourses(); setRefreshing(false) }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My Subjects</Text>
        <Text style={s.headerSubtitle}>Your enrolled courses</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <Ionicons name="book-outline" size={48} color={tokens.colors.textMuted} />
          <Text style={s.emptyText}>Loading subjects...</Text>
        </View>
      ) : courses.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="book-outline" size={48} color={tokens.colors.textMuted} />
          <Text style={s.emptyText}>No subjects enrolled yet</Text>
          <Text style={s.emptySubtext}>Subjects will appear here once you are enrolled</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.primary} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.courseCard} activeOpacity={0.7}>
              <View style={[s.courseIcon, { backgroundColor: tokens.colors.primary + '20' }]}>
                <Ionicons name="book" size={24} color={tokens.colors.primary} />
              </View>
              <View style={s.courseInfo}>
                <Text style={s.courseName}>{item.subjects?.name || 'Unknown Subject'}</Text>
                <Text style={s.courseCode}>{item.subjects?.code || ''}</Text>
                <Text style={s.courseTeacher}>Instructor: {item.subjects?.teacher_name || 'TBA'}</Text>
              </View>
              <View style={s.courseGrade}>
                <Text style={s.gradeText}>{item.grade || 'N/A'}</Text>
                <Text style={s.gradeLabel}>Grade</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}
