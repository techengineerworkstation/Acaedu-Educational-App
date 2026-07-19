import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { signIn } from '../lib/supabase'
import { colors, spacing, borderRadius } from '../lib/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await signIn(email.trim(), password)
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your Acaedu account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.loginButton, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
              <Text style={styles.loginButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/register')}>
              <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerBold}>Sign Up</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flex: 1, padding: spacing.xl },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.bgCard, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  header: { marginBottom: spacing.xxl },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs },
  form: { gap: spacing.lg },
  inputGroup: { gap: spacing.xs },
  label: { color: colors.text, fontSize: 13, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border },
  inputIcon: { marginLeft: spacing.md },
  input: { flex: 1, color: '#fff', fontSize: 15, padding: spacing.lg, paddingLeft: spacing.sm },
  eyeButton: { padding: spacing.md },
  forgotText: { color: colors.primary, fontSize: 13, fontWeight: '600', textAlign: 'right' },
  loginButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.md },
  disabledButton: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: 12, marginHorizontal: spacing.md },
  registerLink: { alignItems: 'center' },
  registerText: { color: colors.textMuted, fontSize: 14 },
  registerBold: { color: colors.primary, fontWeight: '700' },
})
