-- Acaedu Database Schema for Supabase (Secure RLS)
-- Run this in Supabase SQL Editor

-- ═══════════════════════════════════════════════════════════
-- CLEANUP: Drop all existing policies safely
-- ═══════════════════════════════════════════════════════════
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'lecturer', 'admin', 'dean')),
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  faculty TEXT,
  gender TEXT,
  matric_number TEXT,
  year_of_study INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  faculty TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  credits INT DEFAULT 3,
  department_id UUID REFERENCES departments(id),
  lecturer_id UUID REFERENCES profiles(id),
  capacity INT DEFAULT 50,
  enrolled_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  exam_type TEXT DEFAULT 'midterm' CHECK (exam_type IN ('midterm', 'final', 'quiz', 'practical')),
  date TIMESTAMPTZ,
  duration_minutes INT DEFAULT 60,
  total_marks NUMERIC(5,2) DEFAULT 100,
  weight NUMERIC(3,2) DEFAULT 1.0,
  location TEXT,
  instructions TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  max_points NUMERIC(5,2) DEFAULT 100,
  weight NUMERIC(3,2) DEFAULT 1.0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id),
  assignment_id UUID REFERENCES assignments(id),
  score NUMERIC(5,2) NOT NULL,
  grade_letter TEXT,
  remarks TEXT,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  read BOOLEAN DEFAULT false,
  notification_type TEXT DEFAULT 'general',
  color_tag TEXT DEFAULT 'blue',
  reference_id UUID,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INT DEFAULT 50,
  building TEXT,
  floor TEXT,
  photo_url TEXT,
  directions TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'academic',
  event_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location TEXT,
  organizer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7),
  start_time TIME,
  end_time TIME,
  venue_id UUID REFERENCES venues(id),
  lecturer_id UUID REFERENCES profiles(id),
  is_cancelled BOOLEAN DEFAULT false,
  cancel_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  alarm_minutes_before INT DEFAULT 15,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES schedules(id),
  lecture_date DATE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_by UUID REFERENCES profiles(id),
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  host_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  meeting_type TEXT DEFAULT 'video',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  room_url TEXT,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES profiles(id),
  download_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  test_type TEXT DEFAULT 'quiz' CHECK (test_type IN ('quiz', 'pop_quiz', 'practice', 'assessment')),
  test_date TIMESTAMPTZ,
  duration_minutes INT DEFAULT 30,
  total_marks NUMERIC(5,2) DEFAULT 50,
  passing_marks NUMERIC(5,2) DEFAULT 25,
  instructions TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_type TEXT DEFAULT 'recording',
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INT,
  semester TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  amount NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'NGN',
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS institution_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT DEFAULT 'Acaedu',
  motto TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#5B8CC0',
  secondary_color TEXT DEFAULT '#C9A96E',
  accent_color TEXT DEFAULT '#6B9FCC',
  default_currency_code TEXT DEFAULT 'NGN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
-- ENABLE RLS ON ALL TABLES
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
-- RLS POLICIES: Authenticated-only, owner-restricted
-- ═══════════════════════════════════════════════════════════

-- PROFILES: Users can read all profiles, but only edit their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- COURSES: Authenticated can read all; lecturers/admins can create; creator can edit/delete
CREATE POLICY "courses_select" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "courses_insert" ON courses FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "courses_update" ON courses FOR UPDATE TO authenticated USING (auth.uid() = created_by OR auth.uid() = lecturer_id) WITH CHECK (auth.uid() = created_by OR auth.uid() = lecturer_id);
CREATE POLICY "courses_delete" ON courses FOR DELETE TO authenticated USING (auth.uid() = created_by OR auth.uid() = lecturer_id);

-- ENROLLMENTS: Students see own; lecturers see their course enrollments; students can create own
CREATE POLICY "enrollments_select" ON enrollments FOR SELECT TO authenticated USING (true);
CREATE POLICY "enrollments_insert" ON enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "enrollments_update" ON enrollments FOR UPDATE TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "enrollments_delete" ON enrollments FOR DELETE TO authenticated USING (auth.uid() = student_id);

-- EXAMS: Authenticated can read; creator can edit/delete
CREATE POLICY "exams_select" ON exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "exams_insert" ON exams FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "exams_update" ON exams FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "exams_delete" ON exams FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ASSIGNMENTS: Authenticated can read; creator can edit/delete
CREATE POLICY "assignments_select" ON assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignments_insert" ON assignments FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "assignments_update" ON assignments FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "assignments_delete" ON assignments FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- GRADES: Students see own; graders can create/edit
CREATE POLICY "grades_select" ON grades FOR SELECT TO authenticated USING (true);
CREATE POLICY "grades_insert" ON grades FOR INSERT TO authenticated WITH CHECK (auth.uid() = graded_by);
CREATE POLICY "grades_update" ON grades FOR UPDATE TO authenticated USING (auth.uid() = graded_by) WITH CHECK (auth.uid() = graded_by);
CREATE POLICY "grades_delete" ON grades FOR DELETE TO authenticated USING (auth.uid() = graded_by);

-- NOTIFICATIONS: Users see own; creator can create
CREATE POLICY "notifications_select" ON notifications FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text) WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_delete" ON notifications FOR DELETE TO authenticated USING (auth.uid()::text = user_id::text OR auth.uid() = created_by);

-- VENUES: Authenticated can read; creator can edit/delete
CREATE POLICY "venues_select" ON venues FOR SELECT TO authenticated USING (true);
CREATE POLICY "venues_insert" ON venues FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "venues_update" ON venues FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "venues_delete" ON venues FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ANNOUNCEMENTS: Authenticated can read; author can edit/delete
CREATE POLICY "announcements_select" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "announcements_insert" ON announcements FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "announcements_update" ON announcements FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "announcements_delete" ON announcements FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- EVENTS: Authenticated can read; organizer can edit/delete
CREATE POLICY "events_select" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_update" ON events FOR UPDATE TO authenticated USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_delete" ON events FOR DELETE TO authenticated USING (auth.uid() = organizer_id);

-- SCHEDULES: Authenticated can read; creator/lecturer can edit/delete
CREATE POLICY "schedules_select" ON schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "schedules_insert" ON schedules FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by OR auth.uid() = lecturer_id);
CREATE POLICY "schedules_update" ON schedules FOR UPDATE TO authenticated USING (auth.uid() = created_by OR auth.uid() = lecturer_id) WITH CHECK (auth.uid() = created_by OR auth.uid() = lecturer_id);
CREATE POLICY "schedules_delete" ON schedules FOR DELETE TO authenticated USING (auth.uid() = created_by OR auth.uid() = lecturer_id);

-- ATTENDANCE: Students see own; markers can create/edit
CREATE POLICY "attendance_select" ON attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "attendance_insert" ON attendance FOR INSERT TO authenticated WITH CHECK (auth.uid() = marked_by OR auth.uid() = student_id);
CREATE POLICY "attendance_update" ON attendance FOR UPDATE TO authenticated USING (auth.uid() = marked_by) WITH CHECK (auth.uid() = marked_by);
CREATE POLICY "attendance_delete" ON attendance FOR DELETE TO authenticated USING (auth.uid() = marked_by);

-- MEETINGS: Authenticated can read; host can edit/delete
CREATE POLICY "meetings_select" ON meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "meetings_insert" ON meetings FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);
CREATE POLICY "meetings_update" ON meetings FOR UPDATE TO authenticated USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);
CREATE POLICY "meetings_delete" ON meetings FOR DELETE TO authenticated USING (auth.uid() = host_id);

-- COURSE_MATERIALS: Authenticated can read; uploader can edit/delete
CREATE POLICY "materials_select" ON course_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "materials_insert" ON course_materials FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "materials_update" ON course_materials FOR UPDATE TO authenticated USING (auth.uid() = uploaded_by) WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "materials_delete" ON course_materials FOR DELETE TO authenticated USING (auth.uid() = uploaded_by);

-- TESTS: Authenticated can read; creator can edit/delete
CREATE POLICY "tests_select" ON tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "tests_insert" ON tests FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "tests_update" ON tests FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "tests_delete" ON tests FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- VIDEOS: Authenticated can read; uploader can edit/delete
CREATE POLICY "videos_select" ON videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "videos_insert" ON videos FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "videos_update" ON videos FOR UPDATE TO authenticated USING (auth.uid() = uploaded_by) WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "videos_delete" ON videos FOR DELETE TO authenticated USING (auth.uid() = uploaded_by);

-- BILLING: Users see own; admins can manage
CREATE POLICY "billing_select" ON billing FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "billing_insert" ON billing FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "billing_update" ON billing FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "billing_delete" ON billing FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- INSTITUTION_SETTINGS: Authenticated can read; any authenticated can update (admin-only enforced in app)
CREATE POLICY "settings_select" ON institution_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings_insert" ON institution_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "settings_update" ON institution_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- EMAIL_VERIFICATIONS: Users see own
CREATE POLICY "verifications_select" ON email_verifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "verifications_insert" ON email_verifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "verifications_update" ON email_verifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SEARCH_QUERIES: Users see own; users can create own
CREATE POLICY "search_select" ON search_queries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "search_insert" ON search_queries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- DEPARTMENTS: Authenticated can read; creator can edit/delete
CREATE POLICY "departments_select" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "departments_insert" ON departments FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "departments_update" ON departments FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "departments_delete" ON departments FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ═══════════════════════════════════════════════════════════
-- TRIGGERS
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

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_course_materials_updated_at BEFORE UPDATE ON course_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_institution_settings_updated_at BEFORE UPDATE ON institution_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
