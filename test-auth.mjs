// Test Supabase auth: register + sign in
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mpuhdybttdaxirinrcsp.supabase.co'
const supabaseKey = 'sb_publishable_sOBETQYcRD4QTJZwhqUCXQ_EkQCOJkE'

const supabase = createClient(supabaseUrl, supabaseKey)

const testEmail = `test_${Date.now()}@acatest.com`
const testPassword = 'TestPass123!'
const testName = 'Test Student'

console.log('═══════════════════════════════════════')
console.log('  Acaedu Supabase Auth Test')
console.log('═══════════════════════════════════════')
console.log(`\nTest email: ${testEmail}\n`)

// 1. Test Sign Up
console.log('▶ STEP 1: Testing Sign Up...')
try {
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: { data: { full_name: testName, role: 'student' } },
  })

  if (signupError) {
    console.log(`  ✗ Sign Up FAILED: ${signupError.message}`)
  } else {
    console.log(`  ✓ Sign Up SUCCESS`)
    console.log(`    User ID:  ${signupData.user?.id}`)
    console.log(`    Email:    ${signupData.user?.email}`)
    console.log(`    Confirmed: ${signupData.user?.email_confirmed_at ? 'Yes' : 'Pending (email confirmation required)'}`)
  }
} catch (e) {
  console.log(`  ✗ Sign Up ERROR: ${e.message}`)
}

// 2. Test Sign In with the new account
console.log('\n▶ STEP 2: Testing Sign In...')
try {
  const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })

  if (signinError) {
    console.log(`  ✗ Sign In FAILED: ${signinError.message}`)
    console.log(`    (This may be expected if email confirmation is required)`)
  } else {
    console.log(`  ✓ Sign In SUCCESS`)
    console.log(`    User ID:     ${signinData.user?.id}`)
    console.log(`    Access Token: ${signinData.session?.access_token?.substring(0, 30)}...`)
    console.log(`    Expires At:   ${new Date(signinData.session?.expires_at * 1000).toISOString()}`)
  }
} catch (e) {
  console.log(`  ✗ Sign In ERROR: ${e.message}`)
}

// 3. Test session retrieval
console.log('\n▶ STEP 3: Testing Session Retrieval...')
try {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.log(`  ✗ Session FAILED: ${sessionError.message}`)
  } else if (session) {
    console.log(`  ✓ Active session found`)
    console.log(`    User: ${session.user.email}`)
  } else {
    console.log(`  ○ No active session (expected if email confirmation pending)`)
  }
} catch (e) {
  console.log(`  ✗ Session ERROR: ${e.message}`)
}

// 4. Test Sign Out
console.log('\n▶ STEP 4: Testing Sign Out...')
try {
  const { error: signoutError } = await supabase.auth.signOut()

  if (signoutError) {
    console.log(`  ✗ Sign Out FAILED: ${signoutError.message}`)
  } else {
    console.log(`  ✓ Sign Out SUCCESS`)
  }
} catch (e) {
  console.log(`  ✗ Sign Out ERROR: ${e.message}`)
}

// 5. Test invalid credentials
console.log('\n▶ STEP 5: Testing Invalid Credentials...')
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'nonexistent@test.com',
    password: 'wrongpassword',
  })

  if (error) {
    console.log(`  ✓ Correctly rejected invalid login: "${error.message}"`)
  } else {
    console.log(`  ✗ Should have failed but didn't`)
  }
} catch (e) {
  console.log(`  ✓ Correctly threw error: "${e.message}"`)
}

console.log('\n═══════════════════════════════════════')
console.log('  Auth test complete!')
console.log('═══════════════════════════════════════')
process.exit(0)
