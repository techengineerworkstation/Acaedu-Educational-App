// Flush all table contents to start fresh
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mpuhdybttdaxirinrcsp.supabase.co'
const supabaseKey = 'sb_publishable_sOBETQYcRD4QTJZwhqUCXQ_EkQCOJkE'
const supabase = createClient(supabaseUrl, supabaseKey)

// Tables that have foreign key dependencies — delete in reverse dependency order
const tablesToFlush = [
  'search_queries',
  'email_verifications',
  'billing',
  'ai_summaries',
  'ai_scheduler_suggestions',
  'videos',
  'tests',
  'course_materials',
  'meetings',
  'attendance',
  'schedules',
  'schedule_instances',
  'holidays',
  'events',
  'announcements',
  'venues',
  'notifications',
  'grades',
  'assignments',
  'exams',
  'enrollments',
  'courses',
  'departments',
  'faculties',
  'institutions',
  'profiles',
]

console.log('═══════════════════════════════════════')
console.log('  Acaedu Database Flush')
console.log('═══════════════════════════════════════\n')

let successCount = 0
let failCount = 0
let skipCount = 0

for (const table of tablesToFlush) {
  try {
    // First count existing rows
    const { count, error: countError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.log(`  ○ ${table}: table not found or inaccessible, skipping`)
      skipCount++
      continue
    }

    if (count === 0) {
      console.log(`  ○ ${table}: already empty (0 rows)`)
      skipCount++
      continue
    }

    // Delete all rows
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) {
      // If .neq trick fails, try deleting without filter
      const { error: error2 } = await supabase.from(table).delete().gte('created_at', '1900-01-01')
      if (error2) {
        console.log(`  ✗ ${table}: failed to flush — ${error2.message}`)
        failCount++
      } else {
        console.log(`  ✓ ${table}: flushed ${count} rows`)
        successCount++
      }
    } else {
      console.log(`  ✓ ${table}: flushed ${count} rows`)
      successCount++
    }
  } catch (e) {
    console.log(`  ✗ ${table}: error — ${e.message}`)
    failCount++
  }
}

// Also delete test auth users (keep service role or existing admin)
console.log('\n▶ Flushing test auth users...')
const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
if (!listError && users) {
  for (const user of users) {
    if (user.email?.startsWith('test_') || user.email?.includes('acatest.com')) {
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (!error) {
        console.log(`  ✓ Deleted test user: ${user.email}`)
        successCount++
      } else {
        console.log(`  ○ Could not delete ${user.email}: ${error.message}`)
        skipCount++
      }
    }
  }
}

console.log('\n═══════════════════════════════════════')
console.log(`  Done: ${successCount} flushed, ${skipCount} skipped, ${failCount} failed`)
console.log('═══════════════════════════════════════')
process.exit(0)
