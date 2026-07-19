import { useEffect, useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { supabase, signOut } from '../../lib/supabase'
import { useMobileTheme } from '../../lib/theme'

export default function ProfileScreen() {
  const { tokens } = useMobileTheme()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    header: { padding: tokens.spacing.lg },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
    profileCard: { alignItems: 'center', padding: tokens.spacing.xl, marginHorizontal: tokens.spacing.lg, backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.lg },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: tokens.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: tokens.spacing.md },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
    name: { color: '#fff', fontSize: 20, fontWeight: '800' },
    email: { color: tokens.colors.textMuted, fontSize: 13, marginTop: tokens.spacing.xs },
    roleBadge: { backgroundColor: tokens.colors.primary + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: tokens.spacing.sm },
    roleText: { color: tokens.colors.primary, fontSize: 12, fontWeight: '700' },
    menuSection: { margin: tokens.spacing.lg, backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.lg, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: tokens.spacing.lg, borderBottomWidth: 1, borderBottomColor: tokens.colors.border },
    menuLabel: { flex: 1, color: tokens.colors.text, fontSize: 14, fontWeight: '600', marginLeft: tokens.spacing.md },
    signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: tokens.spacing.lg, padding: tokens.spacing.lg, backgroundColor: tokens.colors.danger + '10', borderRadius: tokens.radii.md, borderWidth: 1, borderColor: tokens.colors.danger + '30' },
    signOutText: { color: tokens.colors.danger, fontSize: 15, fontWeight: '700', marginLeft: tokens.spacing.sm },
  }), [tokens])

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    setProfile(data)
    setLoading(false)
  }

  const handleSignOut = async () => { await signOut(); router.replace('/login') }

  const menuItems = [
    { icon: 'person', label: 'Edit Profile', onPress: () => {} },
    { icon: 'school', label: 'Academic Records', onPress: () => {} },
    { icon: 'card', label: 'Fee Payment', onPress: () => {} },
    { icon: 'document-text', label: 'Reports', onPress: () => {} },
    { icon: 'color-palette', label: 'Academic Theme', onPress: () => router.push('/settings') },
    { icon: 'help-circle', label: 'Help & Support', onPress: () => {} },
    { icon: 'information-circle', label: 'About', onPress: () => {} },
  ]

  return (
    <SafeAreaView style={s.container}>
      <ScrollView>
        <View style={s.header}>
          <Text style={s.headerTitle}>Profile</Text>
        </View>

        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={s.name}>{profile?.full_name || 'User'}</Text>
          <Text style={s.email}>{profile?.email || ''}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleText}>{profile?.role?.charAt(0).toUpperCase() + (profile?.role?.slice(1) || 'Student')}</Text>
          </View>
        </View>

        <View style={s.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={s.menuItem} onPress={item.onPress} activeOpacity={0.7}>
              <Ionicons name={item.icon as any} size={20} color={tokens.colors.textMuted} />
              <Text style={s.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={tokens.colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
          <Ionicons name="log-out" size={20} color={tokens.colors.danger} />
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
