-- Acaedu: Safe RLS policies with column existence checks
-- This migration safely adds columns and applies RLS policies

-- ═══════════════════════════════════════════════════════════
-- STEP 1: Add missing columns safely
-- ═══════════════════════════════════════════════════════════

-- Helper function to add column if not exists
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  p_table TEXT, p_column TEXT, p_type TEXT, p_references TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = p_table AND column_name = p_column
  ) THEN
    IF p_references IS NOT NULL THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s REFERENCES %s', p_table, p_column, p_type, p_references);
    ELSE
      EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', p_table, p_column, p_type);
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add created_by columns
SELECT add_column_if_not_exists('courses', 'created_by', 'UUID', 'profiles(id)');
SELECT add_column_if_not_exists('exams', 'created_by', 'UUID', 'profiles(id)');
SELECT add_column_if_not_exists('assignments', 'created_by', 'UUID', 'profiles(id)');
SELECT add_column_if_not_exists('venues', 'created_by', 'UUID', 'profiles(id)');
SELECT add_column_if_not_exists('schedules', 'created_by', 'UUID', 'profiles(id)');
SELECT add_column_if_not_exists('tests', 'created_by', 'UUID', 'profiles(id)');
SELECT add_column_if_not_exists('departments', 'created_by', 'UUID', 'profiles(id)');
SELECT add_column_if_not_exists('notifications', 'created_by', 'UUID', 'profiles(id)');

-- Add uploaded_by to videos
SELECT add_column_if_not_exists('videos', 'uploaded_by', 'UUID', 'profiles(id)');

-- Add profile fields
SELECT add_column_if_not_exists('profiles', 'department', 'TEXT', NULL);
SELECT add_column_if_not_exists('profiles', 'faculty', 'TEXT', NULL);
SELECT add_column_if_not_exists('profiles', 'gender', 'TEXT', NULL);
SELECT add_column_if_not_exists('profiles', 'matric_number', 'TEXT', NULL);
SELECT add_column_if_not_exists('profiles', 'year_of_study', 'INT', NULL);

-- Add venue fields
SELECT add_column_if_not_exists('venues', 'floor', 'TEXT', NULL);
SELECT add_column_if_not_exists('venues', 'photo_url', 'TEXT', NULL);
SELECT add_column_if_not_exists('venues', 'directions', 'TEXT', NULL);
SELECT add_column_if_not_exists('venues', 'latitude', 'DOUBLE PRECISION', NULL);
SELECT add_column_if_not_exists('venues', 'longitude', 'DOUBLE PRECISION', NULL);

-- Add schedule fields
SELECT add_column_if_not_exists('schedules', 'is_cancelled', 'BOOLEAN DEFAULT false', NULL);
SELECT add_column_if_not_exists('schedules', 'cancel_reason', 'TEXT', NULL);
SELECT add_column_if_not_exists('schedules', 'cancelled_at', 'TIMESTAMPTZ', NULL);
SELECT add_column_if_not_exists('schedules', 'alarm_minutes_before', 'INT DEFAULT 15', NULL);

-- Add notification field
SELECT add_column_if_not_exists('notifications', 'color_tag', 'TEXT DEFAULT ''blue''', NULL);

-- Add event fields
SELECT add_column_if_not_exists('events', 'event_type', 'TEXT DEFAULT ''academic''', NULL);
SELECT add_column_if_not_exists('events', 'end_date', 'TIMESTAMPTZ', NULL);

-- Add announcement field
SELECT add_column_if_not_exists('announcements', 'target_audience', 'TEXT DEFAULT ''all''', NULL);

-- Add semester to videos
SELECT add_column_if_not_exists('videos', 'semester', 'TEXT', NULL);

-- Add billing table if not exists
CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free',
  amount NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'NGN',
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add email_verifications table if not exists
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add search_queries table if not exists
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clean up helper function
DROP FUNCTION IF EXISTS add_column_if_not_exists;

-- ═══════════════════════════════════════════════════════════
-- STEP 2: Enable RLS on all tables
-- ═══════════════════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- STEP 3: Drop all existing policies
-- ═══════════════════════════════════════════════════════════
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════
-- STEP 4: Create secure RLS policies
-- ═══════════════════════════════════════════════════════════

-- PROFILES
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- COURSES (created_by exists after ALTER TABLE above)
CREATE POLICY "courses_select" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "courses_insert" ON courses FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "courses_update" ON courses FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text OR auth.uid()::text = lecturer_id::text);
CREATE POLICY "courses_delete" ON courses FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text OR auth.uid()::text = lecturer_id::text);

-- ENROLLMENTS
CREATE POLICY "enrollments_select" ON enrollments FOR SELECT TO authenticated USING (true);
CREATE POLICY "enrollments_insert" ON enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = student_id::text);
CREATE POLICY "enrollments_update" ON enrollments FOR UPDATE TO authenticated USING (auth.uid()::text = student_id::text);
CREATE POLICY "enrollments_delete" ON enrollments FOR DELETE TO authenticated USING (auth.uid()::text = student_id::text);

-- EXAMS
CREATE POLICY "exams_select" ON exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "exams_insert" ON exams FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "exams_update" ON exams FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text);
CREATE POLICY "exams_delete" ON exams FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text);

-- ASSIGNMENTS
CREATE POLICY "assignments_select" ON assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignments_insert" ON assignments FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "assignments_update" ON assignments FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text);
CREATE POLICY "assignments_delete" ON assignments FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text);

-- GRADES
CREATE POLICY "grades_select" ON grades FOR SELECT TO authenticated USING (true);
CREATE POLICY "grades_insert" ON grades FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = graded_by::text);
CREATE POLICY "grades_update" ON grades FOR UPDATE TO authenticated USING (auth.uid()::text = graded_by::text);
CREATE POLICY "grades_delete" ON grades FOR DELETE TO authenticated USING (auth.uid()::text = graded_by::text);

-- NOTIFICATIONS
CREATE POLICY "notifications_select" ON notifications FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_delete" ON notifications FOR DELETE TO authenticated USING (auth.uid()::text = user_id::text OR auth.uid()::text = created_by::text);

-- VENUES
CREATE POLICY "venues_select" ON venues FOR SELECT TO authenticated USING (true);
CREATE POLICY "venues_insert" ON venues FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "venues_update" ON venues FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text);
CREATE POLICY "venues_delete" ON venues FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text);

-- ANNOUNCEMENTS
CREATE POLICY "announcements_select" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "announcements_insert" ON announcements FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = author_id::text);
CREATE POLICY "announcements_update" ON announcements FOR UPDATE TO authenticated USING (auth.uid()::text = author_id::text);
CREATE POLICY "announcements_delete" ON announcements FOR DELETE TO authenticated USING (auth.uid()::text = author_id::text);

-- EVENTS
CREATE POLICY "events_select" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = organizer_id::text);
CREATE POLICY "events_update" ON events FOR UPDATE TO authenticated USING (auth.uid()::text = organizer_id::text);
CREATE POLICY "events_delete" ON events FOR DELETE TO authenticated USING (auth.uid()::text = organizer_id::text);

-- SCHEDULES
CREATE POLICY "schedules_select" ON schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "schedules_insert" ON schedules FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text OR auth.uid()::text = lecturer_id::text);
CREATE POLICY "schedules_update" ON schedules FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text OR auth.uid()::text = lecturer_id::text);
CREATE POLICY "schedules_delete" ON schedules FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text OR auth.uid()::text = lecturer_id::text);

-- ATTENDANCE
CREATE POLICY "attendance_select" ON attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "attendance_insert" ON attendance FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = marked_by::text OR auth.uid()::text = student_id::text);
CREATE POLICY "attendance_update" ON attendance FOR UPDATE TO authenticated USING (auth.uid()::text = marked_by::text);
CREATE POLICY "attendance_delete" ON attendance FOR DELETE TO authenticated USING (auth.uid()::text = marked_by::text);

-- MEETINGS
CREATE POLICY "meetings_select" ON meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "meetings_insert" ON meetings FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = host_id::text);
CREATE POLICY "meetings_update" ON meetings FOR UPDATE TO authenticated USING (auth.uid()::text = host_id::text);
CREATE POLICY "meetings_delete" ON meetings FOR DELETE TO authenticated USING (auth.uid()::text = host_id::text);

-- COURSE_MATERIALS
CREATE POLICY "materials_select" ON course_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "materials_insert" ON course_materials FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = uploaded_by::text);
CREATE POLICY "materials_update" ON course_materials FOR UPDATE TO authenticated USING (auth.uid()::text = uploaded_by::text);
CREATE POLICY "materials_delete" ON course_materials FOR DELETE TO authenticated USING (auth.uid()::text = uploaded_by::text);

-- TESTS
CREATE POLICY "tests_select" ON tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "tests_insert" ON tests FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "tests_update" ON tests FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text);
CREATE POLICY "tests_delete" ON tests FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text);

-- VIDEOS
CREATE POLICY "videos_select" ON videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "videos_insert" ON videos FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = uploaded_by::text);
CREATE POLICY "videos_update" ON videos FOR UPDATE TO authenticated USING (auth.uid()::text = uploaded_by::text);
CREATE POLICY "videos_delete" ON videos FOR DELETE TO authenticated USING (auth.uid()::text = uploaded_by::text);

-- BILLING
CREATE POLICY "billing_select" ON billing FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "billing_insert" ON billing FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "billing_update" ON billing FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "billing_delete" ON billing FOR DELETE TO authenticated USING (auth.uid()::text = user_id::text);

-- INSTITUTION_SETTINGS
CREATE POLICY "settings_select" ON institution_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings_insert" ON institution_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "settings_update" ON institution_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- EMAIL_VERIFICATIONS
CREATE POLICY "verifications_select" ON email_verifications FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "verifications_insert" ON email_verifications FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "verifications_update" ON email_verifications FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text);

-- SEARCH_QUERIES
CREATE POLICY "search_select" ON search_queries FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "search_insert" ON search_queries FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);

-- DEPARTMENTS
CREATE POLICY "departments_select" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "departments_insert" ON departments FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "departments_update" ON departments FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text);
CREATE POLICY "departments_delete" ON departments FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text);

-- ═══════════════════════════════════════════════════════════
-- STEP 5: Triggers
-- ═══════════════════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers safely
DO $$ BEGIN CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_course_materials_updated_at BEFORE UPDATE ON course_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER update_institution_settings_updated_at BEFORE UPDATE ON institution_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
