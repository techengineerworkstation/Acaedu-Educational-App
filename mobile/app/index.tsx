import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors, spacing, borderRadius } from '../lib/theme'

export default function Index() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
      setLoading(false)
    })
  }, [])

  if (loading) return null
  if (user) return <Redirect href="/(tabs)" />

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.title}>Acaedu</Text>
        <Text style={styles.subtitle}>Professional Academic Platform</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>Start Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  logoContainer: { alignItems: 'center', marginBottom: spacing.xxl * 2 },
  logo: { width: 80, height: 80, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  logoText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs },
  buttons: { width: '100%', gap: spacing.md },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: borderRadius.md, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: colors.border, paddingVertical: 16, borderRadius: borderRadius.md, alignItems: 'center' },
  secondaryButtonText: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
})
