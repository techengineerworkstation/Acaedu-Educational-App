import { useState, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { signIn } from '../lib/supabase'
import { useMobileTheme } from '../lib/theme'

export default function LoginScreen() {
  const { tokens } = useMobileTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    flex: { flex: 1 },
    content: { flex: 1, padding: tokens.spacing.xl },
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
    forgotText: { color: tokens.colors.primary, fontSize: 13, fontWeight: '600', textAlign: 'right' },
    loginButton: { backgroundColor: tokens.colors.primary, paddingVertical: 16, borderRadius: tokens.radii.md, alignItems: 'center', marginTop: tokens.spacing.md },
    disabledButton: { opacity: 0.6 },
    loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: tokens.spacing.md },
    dividerLine: { flex: 1, height: 1, backgroundColor: tokens.colors.border },
    dividerText: { color: tokens.colors.textMuted, fontSize: 12, marginHorizontal: tokens.spacing.md },
    registerLink: { alignItems: 'center' },
    registerText: { color: tokens.colors.textMuted, fontSize: 14 },
    registerBold: { color: tokens.colors.primary, fontWeight: '700' },
  }), [tokens])

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { Alert.alert('Error', 'Please fill in all fields'); return }
    setLoading(true)
    try { await signIn(email.trim(), password); router.replace('/(tabs)') }
    catch (error: any) { Alert.alert('Login Failed', error.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.content}>
          <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
          </TouchableOpacity>
          <View style={s.header}>
            <Text style={s.title}>Welcome Back</Text>
            <Text style={s.subtitle}>Sign in to your Acaedu account</Text>
          </View>
          <View style={s.form}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Email</Text>
              <View style={s.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={tokens.colors.textMuted} style={s.inputIcon} />
                <TextInput style={s.input} placeholder="Enter your email" placeholderTextColor={tokens.colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
              </View>
            </View>
            <View style={s.inputGroup}>
              <Text style={s.label}>Password</Text>
              <View style={s.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={tokens.colors.textMuted} style={s.inputIcon} />
                <TextInput style={s.input} placeholder="Enter your password" placeholderTextColor={tokens.colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={tokens.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity><Text style={s.forgotText}>Forgot Password?</Text></TouchableOpacity>
            <TouchableOpacity style={[s.loginButton, loading && s.disabledButton]} onPress={handleLogin} disabled={loading}>
              <Text style={s.loginButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </TouchableOpacity>
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>OR</Text>
              <View style={s.dividerLine} />
            </View>
            <TouchableOpacity style={s.registerLink} onPress={() => router.push('/register')}>
              <Text style={s.registerText}>Don't have an account? <Text style={s.registerBold}>Sign Up</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
