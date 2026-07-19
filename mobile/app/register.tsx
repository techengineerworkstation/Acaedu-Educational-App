import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { signUp } from '../lib/supabase'
import { colors, spacing, borderRadius } from '../lib/theme'

const ROLES = [
  { value: 'student', label: 'Student', icon: 'school' },
  { value: 'teacher', label: 'Teacher', icon: 'person' },
  { value: 'parent', label: 'Parent', icon: 'people' },
]

export default function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUp(email.trim(), password, name.trim(), role)
      Alert.alert('Success', 'Account created! Please check your email to verify.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ])
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Acaedu platform today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

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
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>I am a</Text>
              <View style={styles.roleRow}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.roleOption, role === r.value && styles.roleActive]}
                    onPress={() => setRole(r.value)}
                  >
                    <Ionicons name={r.icon as any} size={20} color={role === r.value ? '#fff' : colors.textMuted} />
                    <Text style={[styles.roleLabel, role === r.value && styles.roleLabelActive]}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={[styles.registerButton, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
              <Text style={styles.registerButtonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Sign In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scrollContent: { padding: spacing.xl },
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
  roleRow: { flexDirection: 'row', gap: spacing.sm },
  roleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, backgroundColor: colors.bgCard, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, gap: spacing.xs },
  roleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  roleLabelActive: { color: '#fff' },
  registerButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.md },
  disabledButton: { opacity: 0.6 },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: spacing.lg },
  loginText: { color: colors.textMuted, fontSize: 14 },
  loginBold: { color: colors.primary, fontWeight: '700' },
})
