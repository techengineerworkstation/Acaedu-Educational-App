import { Redirect } from 'expo-router'
import { useEffect, useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'
import { useMobileTheme } from '../lib/theme'

export default function Index() {
  const { tokens } = useMobileTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.xl },
    logoContainer: { alignItems: 'center', marginBottom: tokens.spacing.xxl * 2 },
    logo: { width: 80, height: 80, borderRadius: 20, backgroundColor: tokens.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: tokens.spacing.lg },
    logoText: { color: '#fff', fontSize: 32, fontWeight: '800' },
    title: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
    subtitle: { color: tokens.colors.textMuted, fontSize: 14, marginTop: tokens.spacing.xs },
    buttons: { width: '100%', gap: tokens.spacing.md },
    primaryButton: { backgroundColor: tokens.colors.primary, paddingVertical: 16, borderRadius: tokens.radii.md, alignItems: 'center' },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    secondaryButton: { borderWidth: 1, borderColor: tokens.colors.border, paddingVertical: 16, borderRadius: tokens.radii.md, alignItems: 'center' },
    secondaryButtonText: { color: tokens.colors.textMuted, fontSize: 16, fontWeight: '600' },
  }), [tokens])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
      setLoading(false)
    })
  }, [])

  if (loading) return null
  if (user) return <Redirect href="/(tabs)" />

  return (
    <View style={s.container}>
      <View style={s.logoContainer}>
        <View style={s.logo}>
          <Text style={s.logoText}>A</Text>
        </View>
        <Text style={s.title}>Acaedu</Text>
        <Text style={s.subtitle}>Professional Academic Platform</Text>
      </View>
      <View style={s.buttons}>
        <TouchableOpacity style={s.primaryButton} onPress={() => {}}>
          <Text style={s.primaryButtonText}>Start Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryButton} onPress={() => {}}>
          <Text style={s.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
