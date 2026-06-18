-- Acaedu Database Schema for Supabase (Fixed)
-- Run this in Supabase SQL Editor

-- Drop existing policies first (safe to run even if they don't exist)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read" ON courses;
  DROP POLICY IF EXISTS "Public read" ON venues;
  DROP POLICY IF EXISTS "Public read" ON announcements;
  DROP POLICY IF EXISTS "Public read" ON events;
  DROP POLICY IF EXISTS "Public read" ON institution_settings;
  DROP POLICY IF EXISTS "Auth read" ON notifications;
  DROP POLICY IF EXISTS "Auth read" ON enrollments;
  DROP POLICY IF EXISTS "Auth read" ON grades;
  DROP POLICY IF EXISTS "Auth read" ON exams;
  DROP POLICY IF EXISTS "Auth read" ON assignments;
  DROP POLICY IF EXISTS "Auth read" ON schedules;
  DROP POLICY IF EXISTS "Auth read" ON meetings;
  DROP POLICY IF EXISTS "Auth read" ON course_materials;
  DROP POLICY IF EXISTS "Auth read" ON tests;
  DROP POLICY IF EXISTS "Auth read" ON videos;
  DROP POLICY IF EXISTS "Auth read" ON attendance;
  DROP POLICY IF EXISTS "Auth read" ON profiles;
  DROP POLICY IF EXISTS "Auth insert" ON profiles;
  DROP POLICY IF EXISTS "Auth insert" ON enrollments;
  DROP POLICY IF EXISTS "Auth insert" ON courses;
  DROP POLICY IF EXISTS "Auth insert" ON exams;
  DROP POLICY IF EXISTS "Auth insert" ON assignments;
  DROP POLICY IF EXISTS "Auth insert" ON grades;
  DROP POLICY IF EXISTS "Auth insert" ON notifications;
  DROP POLICY IF EXISTS "Auth insert" ON venues;
  DROP POLICY IF EXISTS "Auth insert" ON announcements;
  DROP POLICY IF EXISTS "Auth insert" ON events;
  DROP POLICY IF EXISTS "Auth insert" ON schedules;
  DROP POLICY IF EXISTS "Auth insert" ON attendance;
  DROP POLICY IF EXISTS "Auth insert" ON meetings;
  DROP POLICY IF EXISTS "Auth insert" ON course_materials;
  DROP POLICY IF EXISTS "Auth insert" ON tests;
  DROP POLICY IF EXISTS "Auth insert" ON videos;
  DROP POLICY IF EXISTS "Auth insert" ON institution_settings;
  DROP POLICY IF EXISTS "Auth update" ON profiles;
  DROP POLICY IF EXISTS "Auth update" ON courses;
  DROP POLICY IF EXISTS "Auth update" ON exams;
  DROP POLICY IF EXISTS "Auth update" ON assignments;
  DROP POLICY IF EXISTS "Auth update" ON grades;
  DROP POLICY IF EXISTS "Auth update" ON notifications;
  DROP POLICY IF EXISTS "Auth update" ON venues;
  DROP POLICY IF EXISTS "Auth update" ON announcements;
  DROP POLICY IF EXISTS "Auth update" ON events;
  DROP POLICY IF EXISTS "Auth update" ON schedules;
  DROP POLICY IF EXISTS "Auth update" ON attendance;
  DROP POLICY IF EXISTS "Auth update" ON meetings;
  DROP POLICY IF EXISTS "Auth update" ON course_materials;
  DROP POLICY IF EXISTS "Auth update" ON tests;
  DROP POLICY IF EXISTS "Auth update" ON videos;
  DROP POLICY IF EXISTS "Auth update" ON institution_settings;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Users table
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

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  faculty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses/Subjects
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(student_id, course_id)
);

-- Exams
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  max_points NUMERIC(5,2) DEFAULT 100,
  weight NUMERIC(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades
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

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  read BOOLEAN DEFAULT false,
  notification_type TEXT DEFAULT 'general',
  color_tag TEXT DEFAULT 'blue',
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
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

-- Events
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

-- Schedules
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance
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

-- Meetings/Live Classes
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

-- Course Materials
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

-- Tests
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos/Lectures
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing
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

-- Institution Settings
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

-- Email Verifications
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search Queries
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- RLS Policies
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on all tables
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

-- Public read policies (no auth required)
CREATE POLICY "Public read" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read" ON venues FOR SELECT USING (true);
CREATE POLICY "Public read" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read" ON events FOR SELECT USING (true);
CREATE POLICY "Public read" ON institution_settings FOR SELECT USING (true);
CREATE POLICY "Public read" ON exams FOR SELECT USING (true);
CREATE POLICY "Public read" ON assignments FOR SELECT USING (true);
CREATE POLICY "Public read" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public read" ON meetings FOR SELECT USING (true);
CREATE POLICY "Public read" ON course_materials FOR SELECT USING (true);
CREATE POLICY "Public read" ON tests FOR SELECT USING (true);
CREATE POLICY "Public read" ON videos FOR SELECT USING (true);
CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public read" ON enrollments FOR SELECT USING (true);
CREATE POLICY "Public read" ON grades FOR SELECT USING (true);
CREATE POLICY "Public read" ON attendance FOR SELECT USING (true);
CREATE POLICY "Public read" ON billing FOR SELECT USING (true);

-- Insert policies
CREATE POLICY "Auth insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON grades FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON venues FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON course_materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON billing FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert" ON institution_settings FOR INSERT WITH CHECK (true);

-- Update policies
CREATE POLICY "Auth update" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON courses FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON exams FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON assignments FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON grades FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON venues FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON events FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON schedules FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON meetings FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON course_materials FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON tests FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON videos FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON billing FOR UPDATE USING (true);
CREATE POLICY "Auth update" ON institution_settings FOR UPDATE USING (true);

-- Delete policies
CREATE POLICY "Auth delete" ON courses FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON exams FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON assignments FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON grades FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON notifications FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON venues FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON announcements FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON events FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON schedules FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON meetings FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON course_materials FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON tests FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON videos FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON attendance FOR DELETE USING (true);
CREATE POLICY "Auth delete" ON billing FOR DELETE USING (true);

-- ═══════════════════════════════════════════════════════════
-- Triggers
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

-- Drop and recreate trigger
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

-- Apply updated_at triggers
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
