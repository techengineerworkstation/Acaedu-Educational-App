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
  created_at: string
}
