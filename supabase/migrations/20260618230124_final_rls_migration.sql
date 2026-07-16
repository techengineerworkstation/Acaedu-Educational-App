-- Acaedu: Final safe migration with explicit column adds
-- This migration adds ALL missing columns and then creates RLS policies

-- ═══════════════════════════════════════════════════════════
-- STEP 1: Add missing columns to enrollments
-- ═══════════════════════════════════════════════════════════
DO $$ BEGIN
  ALTER TABLE enrollments ADD COLUMN student_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE enrollments ADD COLUMN status TEXT DEFAULT 'active';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to courses
DO $$ BEGIN
  ALTER TABLE courses ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to exams
DO $$ BEGIN
  ALTER TABLE exams ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to assignments
DO $$ BEGIN
  ALTER TABLE assignments ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to venues
DO $$ BEGIN
  ALTER TABLE venues ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to schedules
DO $$ BEGIN
  ALTER TABLE schedules ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to tests
DO $$ BEGIN
  ALTER TABLE tests ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to departments
DO $$ BEGIN
  ALTER TABLE departments ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add created_by to notifications
DO $$ BEGIN
  ALTER TABLE notifications ADD COLUMN created_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add uploaded_by to videos
DO $$ BEGIN
  ALTER TABLE videos ADD COLUMN uploaded_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add profile fields
DO $$ BEGIN ALTER TABLE profiles ADD COLUMN department TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE profiles ADD COLUMN faculty TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE profiles ADD COLUMN gender TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE profiles ADD COLUMN matric_number TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE profiles ADD COLUMN year_of_study INT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Add venue fields
DO $$ BEGIN ALTER TABLE venues ADD COLUMN floor TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE venues ADD COLUMN photo_url TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE venues ADD COLUMN directions TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE venues ADD COLUMN latitude DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE venues ADD COLUMN longitude DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Add schedule fields
DO $$ BEGIN ALTER TABLE schedules ADD COLUMN is_cancelled BOOLEAN DEFAULT false; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE schedules ADD COLUMN cancel_reason TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE schedules ADD COLUMN cancelled_at TIMESTAMPTZ; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE schedules ADD COLUMN alarm_minutes_before INT DEFAULT 15; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Add notification field
DO $$ BEGIN ALTER TABLE notifications ADD COLUMN color_tag TEXT DEFAULT 'blue'; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Add event fields
DO $$ BEGIN ALTER TABLE events ADD COLUMN event_type TEXT DEFAULT 'academic'; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE events ADD COLUMN end_date TIMESTAMPTZ; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Add announcement field
DO $$ BEGIN ALTER TABLE announcements ADD COLUMN target_audience TEXT DEFAULT 'all'; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Add semester to videos
DO $$ BEGIN ALTER TABLE videos ADD COLUMN semester TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Create missing tables
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

CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- STEP 2: Enable RLS
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
-- STEP 3: Drop ALL existing policies
-- ═══════════════════════════════════════════════════════════
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════
-- STEP 4: Create RLS policies
-- ═══════════════════════════════════════════════════════════

-- PROFILES
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- COURSES
CREATE POLICY "courses_select" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "courses_insert" ON courses FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "courses_update" ON courses FOR UPDATE TO authenticated USING (auth.uid()::text = created_by::text OR auth.uid()::text = lecturer_id::text);
CREATE POLICY "courses_delete" ON courses FOR DELETE TO authenticated USING (auth.uid()::text = created_by::text OR auth.uid()::text = lecturer_id::text);

-- ENROLLMENTS (now has student_id after ALTER TABLE above)
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

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
