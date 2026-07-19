import { useState, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { signUp } from '../lib/supabase'
import { useMobileTheme } from '../lib/theme'

const ROLES = [
  { value: 'student', label: 'Student', icon: 'school' },
  { value: 'teacher', label: 'Teacher', icon: 'person' },
  { value: 'parent', label: 'Parent', icon: 'people' },
]

export default function RegisterScreen() {
  const { tokens } = useMobileTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    flex: { flex: 1 },
    scrollContent: { padding: tokens.spacing.xl },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: tokens.colors.bgCard, justifyContent: 'center', alignItems: 'center', marginBottom: tokens.spacing.xl },
    header: { marginBottom: tokens.spacing.xxl },
    title: { color: '#fff', fontSize: 28, fontWeight: '800' },
    subtitle: { color: tokens.colors.textMuted, fontSize: 14, marginTop: tokens.spacing.xs },
    form: { gap: tokens.spacing.lg },
    inputGroup: { gap: tokens.spacing.xs },
    label: { color: tokens.colors.text, fontSize: 13, fontWeight: '600' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, borderWidth: 1, borderColor: tokens.colors.border },
    inputIcon: { marginLeft: tokens.spacing.md },
    input: { flex: 1, color: '#fff', fontSize: 15, padding: tokens.spacing.lg, paddingLeft: tokens.spacing.sm },
    eyeButton: { padding: tokens.spacing.md },
    roleRow: { flexDirection: 'row', gap: tokens.spacing.sm },
    roleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: tokens.spacing.md, backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.md, borderWidth: 1, borderColor: tokens.colors.border, gap: tokens.spacing.xs },
    roleActive: { backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary },
    roleLabel: { color: tokens.colors.textMuted, fontSize: 13, fontWeight: '600' },
    roleLabelActive: { color: '#fff' },
    registerButton: { backgroundColor: tokens.colors.primary, paddingVertical: 16, borderRadius: tokens.radii.md, alignItems: 'center', marginTop: tokens.spacing.md },
    disabledButton: { opacity: 0.6 },
    registerButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    loginLink: { alignItems: 'center', marginTop: tokens.spacing.lg },
    loginText: { color: tokens.colors.textMuted, fontSize: 14 },
    loginBold: { color: tokens.colors.primary, fontWeight: '700' },
  }), [tokens])

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) { Alert.alert('Error', 'Please fill in all fields'); return }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signUp(email.trim(), password, name.trim(), role)
      Alert.alert('Success', 'Account created! Please check your email to verify.', [{ text: 'OK', onPress: () => router.replace('/login') }])
    } catch (error: any) { Alert.alert('Registration Failed', error.message || 'Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
          </TouchableOpacity>
          <View style={s.header}>
            <Text style={s.title}>Create Account</Text>
            <Text style={s.subtitle}>Join the Acaedu platform today</Text>
          </View>
          <View style={s.form}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Full Name</Text>
              <View style={s.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={tokens.colors.textMuted} style={s.inputIcon} />
                <TextInput style={s.input} placeholder="Enter your full name" placeholderTextColor={tokens.colors.textMuted} value={name} onChangeText={setName} autoCapitalize="words" />
              </View>
            </View>
            <View style={s.inputGroup}>
              <Text style={s.label}>Email</Text>
              <View style={s.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={tokens.colors.textMuted} style={s.inputIcon} />
                <TextInput style={s.input} placeholder="Enter your email" placeholderTextColor={tokens.colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>
            <View style={s.inputGroup}>
              <Text style={s.label}>Password</Text>
              <View style={s.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={tokens.colors.textMuted} style={s.inputIcon} />
                <TextInput style={s.input} placeholder="Create a password" placeholderTextColor={tokens.colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={tokens.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.inputGroup}>
              <Text style={s.label}>Confirm Password</Text>
              <View style={s.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={tokens.colors.textMuted} style={s.inputIcon} />
                <TextInput style={s.input} placeholder="Confirm your password" placeholderTextColor={tokens.colors.textMuted} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
              </View>
            </View>
            <View style={s.inputGroup}>
              <Text style={s.label}>I am a</Text>
              <View style={s.roleRow}>
                {ROLES.map((r) => (
                  <TouchableOpacity key={r.value} style={[s.roleOption, role === r.value && s.roleActive]} onPress={() => setRole(r.value)}>
                    <Ionicons name={r.icon as any} size={20} color={role === r.value ? '#fff' : tokens.colors.textMuted} />
                    <Text style={[s.roleLabel, role === r.value && s.roleLabelActive]}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={[s.registerButton, loading && s.disabledButton]} onPress={handleRegister} disabled={loading}>
              <Text style={s.registerButtonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.loginLink} onPress={() => router.push('/login')}>
              <Text style={s.loginText}>Already have an account? <Text style={s.loginBold}>Sign In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
