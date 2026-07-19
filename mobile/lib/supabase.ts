import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL || ''
const supabaseKey = Constants.expoConfig?.extra?.SUPABASE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, name: string, role: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, role } },
  })
  if (error) throw error
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: name,
      role,
    }, { onConflict: 'id' })
  }
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}
