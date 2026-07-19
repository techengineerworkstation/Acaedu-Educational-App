export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'lecturer' | 'admin' | 'dean'
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  course_code: string
  title: string
  description?: string
  credits: number
  department_id?: string
  lecturer_id?: string
  created_at: string
}

export interface Exam {
  id: string
  course_id: string
  title: string
  description?: string
  exam_type: string
  date: string
  duration_minutes: number
  total_marks: number
  created_at: string
}

export interface Grade {
  id: string
  student_id: string
  course_id: string
  score: number
  grade_letter?: string
  remarks?: string
  created_at: string
}

export interface Assignment {
  id: string
  course_id: string
  title: string
  description?: string
  due_date?: string
  max_points?: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  read: boolean
  notification_type: string
  created_at: string
}

export interface Venue {
  id: string
  name: string
  capacity: number
  building?: string
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  author_id: string
  priority: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date?: string
  location?: string
  created_at: string
}

export interface Schedule {
  id: string
  course_id?: string
  day_of_week: number
  start_time: string
  end_time: string
  venue_id?: string
  lecturer_id?: string
  is_cancelled: boolean
  cancel_reason?: string
  alarm_minutes_before: number
  created_by?: string
  created_at: string
  // Joined
  courses?: Course
  venues?: Venue
}

export interface ScheduleInstance {
  id: string
  schedule_id: string
  instance_date: string
  start_time: string
  end_time: string
  is_cancelled: boolean
  cancel_reason?: string
  notes?: string
  created_at: string
}

export interface Faculty {
  id: string
  name: string
  code?: string
  dean_id?: string
  created_at: string
  updated_at: string
}

export interface Institution {
  id: string
  name: string
  code?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  motto?: string
  created_at: string
  updated_at: string
}

export interface BillingSubscription {
  id: string
  user_id: string
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  amount: number
  currency: string
  payment_method?: string
  transaction_id?: string
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  starts_at: string
  expires_at?: string
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  payment_method?: string
  transaction_id?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface FeatureAccess {
  id: string
  feature_name: string
  plan_required: string
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Holiday {
  id: string
  name: string
  date: string
  type: string
  created_by?: string
  created_at: string
}

export interface CourseConstraint {
  id: string
  course_id: string
  preferred_days: number[]
  preferred_times: string[]
  room_requirements: string
  priority: 'high' | 'medium' | 'low'
  created_at: string
}

export interface AiSuggestion {
  id: string
  course_id: string
  suggested_day: number
  suggested_start: string
  suggested_end: string
  suggested_venue_id?: string
  score: number
  reason: string
  status: 'pending' | 'accepted' | 'rejected'
  created_by?: string
  created_at: string
}

export interface AiSummary {
  id: string
  course_id: string
  video_id?: string
  summary_text: string
  key_points?: string
  word_count: number
  generated_by?: string
  created_at: string
}

export interface CourseMaterial {
  id: string
  course_id: string
  title: string
  description?: string
  file_url?: string
  file_type?: string
  file_size?: number
  uploaded_by?: string
  download_count: number
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  course_id: string
  title: string
  description?: string
  video_type: string
  video_url?: string
  thumbnail_url?: string
  duration_seconds?: number
  semester?: string
  uploaded_by?: string
  created_at: string
  updated_at: string
}

export interface Meeting {
  id: string
  title: string
  description?: string
  host_id?: string
  course_id?: string
  meeting_type: string
  start_time?: string
  end_time?: string
  room_url?: string
  recording_url?: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}
