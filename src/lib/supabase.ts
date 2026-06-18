import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function signUp(email: string, password: string, name: string, role: string) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role } } })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } })
  if (error) throw error
  return data
}

export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: window.location.origin + '/dashboard' } })
  if (error) throw error
  return data
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function fetchTable(table: string, filters?: Record<string, any>) {
  let query = supabase.from(table).select('*')
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => { query = query.eq(key, val) })
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function insertRow(table: string, row: Record<string, any>) {
  const { data, error } = await supabase.from(table).insert(row).select().single()
  if (error) throw error
  return data
}

export async function updateRow(table: string, id: string, updates: Record<string, any>) {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteRow(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}
