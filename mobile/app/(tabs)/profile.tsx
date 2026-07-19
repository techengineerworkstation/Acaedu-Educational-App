import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { supabase, signOut } from '../../lib/supabase'
import { colors, spacing, borderRadius } from '../../lib/theme'

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  const menuItems = [
    { icon: 'person', label: 'Edit Profile', onPress: () => {} },
    { icon: 'school', label: 'Academic Records', onPress: () => {} },
    { icon: 'card', label: 'Fee Payment', onPress: () => {} },
    { icon: 'document-text', label: 'Reports', onPress: () => {} },
    { icon: 'help-circle', label: 'Help & Support', onPress: () => {} },
    { icon: 'information-circle', label: 'About', onPress: () => {} },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
          <Text style={styles.email}>{profile?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile?.role?.charAt(0).toUpperCase() + (profile?.role?.slice(1) || 'Student')}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
              <Ionicons name={item.icon as any} size={20} color={colors.textMuted} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
          <Ionicons name="log-out" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.lg },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  profileCard: { alignItems: 'center', padding: spacing.xl, marginHorizontal: spacing.lg, backgroundColor: colors.bgCard, borderRadius: borderRadius.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  name: { color: '#fff', fontSize: 20, fontWeight: '800' },
  email: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  roleBadge: { backgroundColor: colors.primary + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: spacing.sm },
  roleText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  menuSection: { margin: spacing.lg, backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '600', marginLeft: spacing.md },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.danger + '10', borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.danger + '30' },
  signOutText: { color: colors.danger, fontSize: 15, fontWeight: '700', marginLeft: spacing.sm },
})
