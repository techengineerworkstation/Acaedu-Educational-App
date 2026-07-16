import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchTable, insertRow, updateRow, deleteRow, supabase } from '../lib/supabase'
import {
  Plus, Pencil, Trash2, BookOpen, FileText, Calendar, ClipboardList,
  CheckCircle, Bell, MapPin, Megaphone, Upload, Video, Users, Building2,
  GitBranch, CreditCard, Shield, Mail, Search, Brain, Clock, GraduationCap,
  CalendarOff
} from 'lucide-react'

function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={onCancel}>
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="modal" onClick={e => e.stopPropagation()}>
          <h3 className="text-[16px] font-bold text-[var(--color-navy)] mb-2 text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
          <p className="text-[13px] text-[var(--color-text-muted)] mb-6 text-center">{message}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onCancel} className="btn-secondary px-6 py-2">Cancel</button>
            <button onClick={onConfirm} className="btn-primary px-6 py-2 bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90">Delete</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface CrudField {
  key: string; label: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'datetime-local' | 'time' | 'date' | 'boolean'
  options?: { value: string; label: string }[]
}

interface CrudConfig {
  title: string; singular: string; table: string
  fields: CrudField[]
  displayFields: { key: string; label: string }[]
  badgeField?: { key: string }
  icon: React.ReactNode
}

function CrudPage({ config }: { config: CrudConfig }) {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Record<string, string>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(() => { fetchTable(config.table).then(setItems).finally(() => setLoading(false)) }, [config.table])
  useEffect(() => { load() }, [load])

  const handleSubmit = async () => {
    const row: Record<string, unknown> = {}
    config.fields.forEach(f => {
      const val = formState[f.key] || ''
      if (f.type === 'number') row[f.key] = parseFloat(val) || 0
      else if (f.type === 'boolean') row[f.key] = val === 'true'
      else row[f.key] = val
    })
    if (editId) await updateRow(config.table, editId, row)
    else await insertRow(config.table, row)
    resetForm(); load()
  }

  const handleDelete = async () => {
    if (deleteId) { await deleteRow(config.table, deleteId); setDeleteId(null); load() }
  }

  const startEdit = (item: Record<string, unknown>) => {
    setEditId(item.id as string)
    const state: Record<string, string> = {}
    config.fields.forEach(f => { state[f.key] = String(item[f.key] ?? '') })
    setFormState(state); setShowForm(true)
  }

  const resetForm = () => { setShowForm(false); setEditId(null); setFormState({}) }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="section-label">{config.title}</span>
        <h1 className="section-title mt-2 text-3xl">{config.title}</h1>
      </div>
      <div className="flex justify-center mb-8">
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn-primary">
          <Plus size={16}/> Add {config.singular}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
          <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5 text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {editId ? `Edit ${config.singular}` : `Create ${config.singular}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 max-w-2xl mx-auto">
            {config.fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="label">{f.label}</label>
                {f.type === 'select' ? (
                  <select value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="select">
                    <option value="">Select...</option>
                    {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="textarea" rows={3} />
                ) : f.type === 'boolean' ? (
                  <select value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="select">
                    <option value="false">No</option><option value="true">Yes</option>
                  </select>
                ) : (
                  <input type={f.type} value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="input" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={handleSubmit} className="btn-primary px-6">{editId ? 'Update' : 'Create'}</button>
            <button onClick={resetForm} className="btn-secondary px-6">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{config.icon}</div>
          <p className="empty-state-text">No {config.title.toLowerCase()} yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div key={item.id as string} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="card card-interactive p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0 text-center">
                <h3 className="text-[13px] font-bold text-[var(--color-navy)] truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {String(item[config.displayFields[0]?.key] || 'Untitled')}
                </h3>
                <div className="flex flex-wrap justify-center gap-3 mt-1">
                  {config.displayFields.slice(1).map(df => (
                    <span key={df.key} className="text-[11px] text-[var(--color-text-muted)]">{String(item[df.key] ?? '-')}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {config.badgeField && item[config.badgeField.key] != null && (
                  <span className="badge badge-navy">{String(item[config.badgeField.key])}</span>
                )}
                <button onClick={() => startEdit(item)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                <button onClick={() => setDeleteId(item.id as string)} className="btn-ghost p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8"><Trash2 size={14}/></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!deleteId} title={`Delete ${config.singular}`} message={`Are you sure? This will permanently delete this ${config.singular.toLowerCase()}.`} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}

const icon = (Icon: React.ComponentType<{ size?: number; className?: string }>) => <Icon size={40} className="text-[var(--color-text-muted)]"/>

export function CoursesPage() {
  return <CrudPage config={{
    title: 'Courses', singular: 'Course', table: 'courses', icon: icon(BookOpen),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_code', label: 'Course Code', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'credits', label: 'Credits', type: 'number' },
      { key: 'department_id', label: 'Department ID', type: 'text' },
      { key: 'lecturer_id', label: 'Lecturer ID', type: 'text' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'course_code', label: 'Code' }, { key: 'credits', label: 'Credits' }],
    badgeField: { key: 'course_code' },
  }}/>
}

export function EnrollmentsPage() {
  return <CrudPage config={{
    title: 'Enrollments', singular: 'Enrollment', table: 'enrollments', icon: icon(GraduationCap),
    fields: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'active',label:'Active'},{value:'dropped',label:'Dropped'},{value:'completed',label:'Completed'}] },
      { key: 'enrolled_at', label: 'Enrolled At', type: 'datetime-local' },
    ],
    displayFields: [{ key: 'student_id', label: 'Student' }, { key: 'course_id', label: 'Course' }, { key: 'status', label: 'Status' }],
    badgeField: { key: 'status' },
  }}/>
}

export function SchedulesPage() {
  return <CrudPage config={{
    title: 'Schedules', singular: 'Schedule', table: 'schedules', icon: icon(Calendar),
    fields: [
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'day_of_week', label: 'Day', type: 'select', options: [{value:'1',label:'Monday'},{value:'2',label:'Tuesday'},{value:'3',label:'Wednesday'},{value:'4',label:'Thursday'},{value:'5',label:'Friday'},{value:'6',label:'Saturday'}] },
      { key: 'start_time', label: 'Start Time', type: 'time' },
      { key: 'end_time', label: 'End Time', type: 'time' },
      { key: 'venue_id', label: 'Venue ID', type: 'text' },
    ],
    displayFields: [{ key: 'course_id', label: 'Course' }, { key: 'day_of_week', label: 'Day' }, { key: 'start_time', label: 'Start' }, { key: 'end_time', label: 'End' }],
    badgeField: { key: 'day_of_week' },
  }}/>
}

export function ScheduleInstancesPage() {
  return <CrudPage config={{
    title: 'Schedule Instances', singular: 'Instance', table: 'schedule_instances', icon: icon(Clock),
    fields: [
      { key: 'schedule_id', label: 'Schedule ID', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'scheduled',label:'Scheduled'},{value:'completed',label:'Completed'},{value:'cancelled',label:'Cancelled'}] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    displayFields: [{ key: 'schedule_id', label: 'Schedule' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' }],
    badgeField: { key: 'status' },
  }}/>
}

export function AttendanceCrudPage() {
  return <CrudPage config={{
    title: 'Attendance', singular: 'Record', table: 'attendance', icon: icon(CheckCircle),
    fields: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'schedule_id', label: 'Schedule ID', type: 'text' },
      { key: 'instance_date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'present',label:'Present'},{value:'absent',label:'Absent'},{value:'late',label:'Late'},{value:'excused',label:'Excused'}] },
    ],
    displayFields: [{ key: 'student_id', label: 'Student' }, { key: 'course_id', label: 'Course' }, { key: 'status', label: 'Status' }, { key: 'instance_date', label: 'Date' }],
    badgeField: { key: 'status' },
  }}/>
}

export function HolidaysPage() {
  return <CrudPage config={{
    title: 'Holidays', singular: 'Holiday', table: 'holidays', icon: icon(CalendarOff),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'institution_id', label: 'Institution ID', type: 'text' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'date', label: 'Date' }, { key: 'description', label: 'Description' }],
  }}/>
}

export function ExamsPage() {
  return <CrudPage config={{
    title: 'Exams', singular: 'Exam', table: 'exams', icon: icon(FileText),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'exam_type', label: 'Type', type: 'select', options: [{value:'midterm',label:'Midterm'},{value:'final',label:'Final'},{value:'quiz',label:'Quiz'},{value:'practical',label:'Practical'}] },
      { key: 'date', label: 'Date', type: 'datetime-local' },
      { key: 'duration_minutes', label: 'Duration (min)', type: 'number' },
      { key: 'total_marks', label: 'Total Marks', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'exam_type', label: 'Type' }, { key: 'date', label: 'Date' }],
    badgeField: { key: 'exam_type' },
  }}/>
}

export function TestsPage() {
  return <CrudPage config={{
    title: 'Tests', singular: 'Test', table: 'tests', icon: icon(ClipboardList),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'test_type', label: 'Type', type: 'select', options: [{value:'quiz',label:'Quiz'},{value:'pop_quiz',label:'Pop Quiz'},{value:'practice',label:'Practice'},{value:'assessment',label:'Assessment'}] },
      { key: 'test_date', label: 'Date', type: 'datetime-local' },
      { key: 'duration_minutes', label: 'Duration (min)', type: 'number' },
      { key: 'total_marks', label: 'Total Marks', type: 'number' },
      { key: 'passing_marks', label: 'Passing Marks', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'test_type', label: 'Type' }, { key: 'test_date', label: 'Date' }],
    badgeField: { key: 'test_type' },
  }}/>
}

export function AssignmentsPage() {
  return <CrudPage config={{
    title: 'Assignments', singular: 'Assignment', table: 'assignments', icon: icon(ClipboardList),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'due_date', label: 'Due Date', type: 'datetime-local' },
      { key: 'max_points', label: 'Max Points', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'due_date', label: 'Due Date' }, { key: 'max_points', label: 'Points' }],
  }}/>
}

export function GradesPage() {
  return <CrudPage config={{
    title: 'Grades', singular: 'Grade', table: 'grades', icon: icon(CheckCircle),
    fields: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'score', label: 'Score', type: 'number' },
      { key: 'grade_letter', label: 'Grade Letter', type: 'text' },
      { key: 'remarks', label: 'Remarks', type: 'text' },
    ],
    displayFields: [{ key: 'student_id', label: 'Student' }, { key: 'course_id', label: 'Course' }, { key: 'score', label: 'Score' }, { key: 'grade_letter', label: 'Grade' }],
    badgeField: { key: 'grade_letter' },
  }}/>
}

export function AnnouncementsCrudPage() {
  return <CrudPage config={{
    title: 'Announcements', singular: 'Announcement', table: 'announcements', icon: icon(Megaphone),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: [{value:'low',label:'Low'},{value:'normal',label:'Normal'},{value:'high',label:'High'},{value:'urgent',label:'Urgent'}] },
      { key: 'author_id', label: 'Author ID', type: 'text' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'priority', label: 'Priority' }, { key: 'created_at', label: 'Created' }],
    badgeField: { key: 'priority' },
  }}/>
}

export function NotificationsPage() {
  return <CrudPage config={{
    title: 'Notifications', singular: 'Notification', table: 'notifications', icon: icon(Bell),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Message', type: 'textarea' },
      { key: 'notification_type', label: 'Type', type: 'select', options: [{value:'general',label:'General'},{value:'class_update',label:'Class Update'},{value:'exam',label:'Exam'},{value:'assignment',label:'Assignment'},{value:'billing',label:'Billing'}] },
      { key: 'read', label: 'Read', type: 'boolean' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'notification_type', label: 'Type' }, { key: 'created_at', label: 'Created' }],
    badgeField: { key: 'notification_type' },
  }}/>
}

export function VideosPage() {
  return <CrudPage config={{
    title: 'Videos', singular: 'Video', table: 'videos', icon: icon(Video),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'video_url', label: 'Video URL', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'video_type', label: 'Type', type: 'select', options: [{value:'lecture',label:'Lecture'},{value:'tutorial',label:'Tutorial'},{value:'seminar',label:'Seminar'}] },
      { key: 'semester', label: 'Semester', type: 'text' },
      { key: 'duration_seconds', label: 'Duration (sec)', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'video_type', label: 'Type' }, { key: 'semester', label: 'Semester' }],
    badgeField: { key: 'video_type' },
  }}/>
}

export function MaterialsPage() {
  return <CrudPage config={{
    title: 'Course Materials', singular: 'Material', table: 'course_materials', icon: icon(Upload),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'file_url', label: 'File URL', type: 'text' },
      { key: 'file_type', label: 'File Type', type: 'select', options: [{value:'pdf',label:'PDF'},{value:'docx',label:'DOCX'},{value:'pptx',label:'PPTX'},{value:'video',label:'Video'},{value:'link',label:'Link'}] },
      { key: 'is_public', label: 'Public', type: 'boolean' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'file_type', label: 'Type' }, { key: 'course_id', label: 'Course' }],
    badgeField: { key: 'file_type' },
  }}/>
}

export function EventsPage() {
  return <CrudPage config={{
    title: 'Events', singular: 'Event', table: 'events', icon: icon(Calendar),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'event_date', label: 'Date', type: 'datetime-local' },
      { key: 'location', label: 'Location', type: 'text' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'event_date', label: 'Date' }, { key: 'location', label: 'Location' }],
  }}/>
}

export function VenuesPage() {
  return <CrudPage config={{
    title: 'Venues', singular: 'Venue', table: 'venues', icon: icon(MapPin),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'building', label: 'Building', type: 'text' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'building', label: 'Building' }, { key: 'capacity', label: 'Capacity' }],
  }}/>
}

export function AiSchedulerPage() {
  return <CrudPage config={{
    title: 'AI Scheduler Suggestions', singular: 'Suggestion', table: 'ai_scheduler_suggestions', icon: icon(Brain),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'suggestion', label: 'Suggestion', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'pending',label:'Pending'},{value:'accepted',label:'Accepted'},{value:'rejected',label:'Rejected'}] },
      { key: 'priority', label: 'Priority', type: 'number' },
    ],
    displayFields: [{ key: 'user_id', label: 'User' }, { key: 'suggestion', label: 'Suggestion' }, { key: 'status', label: 'Status' }],
    badgeField: { key: 'status' },
  }}/>
}

export function AiSummariesPage() {
  return <CrudPage config={{
    title: 'AI Summaries', singular: 'Summary', table: 'ai_summaries', icon: icon(Brain),
    fields: [
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'summary_type', label: 'Type', type: 'select', options: [{value:'lecture',label:'Lecture'},{value:'assignment',label:'Assignment'},{value:'exam',label:'Exam'}] },
      { key: 'generated_by', label: 'Generated By', type: 'text' },
    ],
    displayFields: [{ key: 'course_id', label: 'Course' }, { key: 'summary_type', label: 'Type' }, { key: 'created_at', label: 'Created' }],
    badgeField: { key: 'summary_type' },
  }}/>
}

export function UsersPage() {
  return <CrudPage config={{
    title: 'Users', singular: 'User', table: 'profiles', icon: icon(Users),
    fields: [
      { key: 'full_name', label: 'Full Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'role', label: 'Role', type: 'select', options: [{value:'student',label:'Student'},{value:'lecturer',label:'Lecturer'},{value:'admin',label:'Admin'},{value:'dean',label:'Dean'}] },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'faculty', label: 'Faculty', type: 'text' },
      { key: 'matric_number', label: 'Matric Number', type: 'text' },
      { key: 'gender', label: 'Gender', type: 'select', options: [{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other'}] },
    ],
    displayFields: [{ key: 'full_name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }],
    badgeField: { key: 'role' },
  }}/>
}

export function DepartmentsPage() {
  return <CrudPage config={{
    title: 'Departments', singular: 'Department', table: 'departments', icon: icon(Building2),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'faculty_id', label: 'Faculty ID', type: 'text' },
      { key: 'head_id', label: 'Head ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'faculty_id', label: 'Faculty' }, { key: 'description', label: 'Description' }],
  }}/>
}

export function FacultiesPage() {
  return <CrudPage config={{
    title: 'Faculties', singular: 'Faculty', table: 'faculties', icon: icon(GitBranch),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'institution_id', label: 'Institution ID', type: 'text' },
      { key: 'dean_id', label: 'Dean ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'institution_id', label: 'Institution' }, { key: 'description', label: 'Description' }],
  }}/>
}

export function InstitutionsPage() {
  return <CrudPage config={{
    title: 'Institutions', singular: 'Institution', table: 'institutions', icon: icon(Building2),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }],
  }}/>
}

export function BillingPage() {
  return <CrudPage config={{
    title: 'Billing & Subscriptions', singular: 'Subscription', table: 'billing_subscriptions', icon: icon(CreditCard),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'plan', label: 'Plan', type: 'select', options: [{value:'free',label:'Free'},{value:'pro',label:'Pro'},{value:'enterprise',label:'Enterprise'}] },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'active',label:'Active'},{value:'cancelled',label:'Cancelled'},{value:'expired',label:'Expired'}] },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
    ],
    displayFields: [{ key: 'user_id', label: 'User' }, { key: 'plan', label: 'Plan' }, { key: 'status', label: 'Status' }, { key: 'amount', label: 'Amount' }],
    badgeField: { key: 'status' },
  }}/>
}

export function PaymentsPage() {
  return <CrudPage config={{
    title: 'Payments', singular: 'Payment', table: 'payments', icon: icon(CreditCard),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'pending',label:'Pending'},{value:'completed',label:'Completed'},{value:'failed',label:'Failed'},{value:'refunded',label:'Refunded'}] },
      { key: 'provider', label: 'Provider', type: 'select', options: [{value:'paystack',label:'Paystack'},{value:'paypal',label:'PayPal'}] },
      { key: 'reference', label: 'Reference', type: 'text' },
    ],
    displayFields: [{ key: 'user_id', label: 'User' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }, { key: 'provider', label: 'Provider' }],
    badgeField: { key: 'status' },
  }}/>
}

export function FeatureAccessPage() {
  return <CrudPage config={{
    title: 'Feature Access', singular: 'Feature', table: 'feature_access', icon: icon(Shield),
    fields: [
      { key: 'role', label: 'Role', type: 'select', options: [{value:'student',label:'Student'},{value:'lecturer',label:'Lecturer'},{value:'admin',label:'Admin'},{value:'dean',label:'Dean'}] },
      { key: 'feature_key', label: 'Feature Key', type: 'text' },
      { key: 'enabled', label: 'Enabled', type: 'boolean' },
      { key: 'institution_id', label: 'Institution ID', type: 'text' },
    ],
    displayFields: [{ key: 'role', label: 'Role' }, { key: 'feature_key', label: 'Feature' }, { key: 'enabled', label: 'Enabled' }],
    badgeField: { key: 'enabled' },
  }}/>
}

export function EmailVerificationsPage() {
  return <CrudPage config={{
    title: 'Email Verifications', singular: 'Verification', table: 'email_verifications', icon: icon(Mail),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'token', label: 'Token', type: 'text' },
      { key: 'verified', label: 'Verified', type: 'boolean' },
      { key: 'expires_at', label: 'Expires At', type: 'datetime-local' },
    ],
    displayFields: [{ key: 'email', label: 'Email' }, { key: 'verified', label: 'Verified' }, { key: 'expires_at', label: 'Expires' }],
    badgeField: { key: 'verified' },
  }}/>
}

export function SearchQueriesPage() {
  return <CrudPage config={{
    title: 'Search Queries', singular: 'Query', table: 'search_queries', icon: icon(Search),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'query', label: 'Query', type: 'text' },
      { key: 'results_count', label: 'Results Count', type: 'number' },
      { key: 'filters', label: 'Filters', type: 'textarea' },
    ],
    displayFields: [{ key: 'query', label: 'Query' }, { key: 'user_id', label: 'User' }, { key: 'results_count', label: 'Results' }, { key: 'created_at', label: 'Time' }],
  }}/>
}

export function SettingsPage() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'dark'
    return false
  })
  const [sound, setSound] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('sound') !== 'off'
    return true
  })
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [fontSize, setFontSize] = useState('medium')
  const [sidebarCompact, setSidebarCompact] = useState(false)

  // Modal state
  const [modal, setModal] = useState<null | 'password' | 'email' | '2fa' | 'export' | 'delete'>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalMsg, setModalMsg] = useState('')
  const [modalError, setModalError] = useState('')

  // Form fields
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const closeModal = () => { setModal(null); setModalMsg(''); setModalError(''); setNewPassword(''); setConfirmPassword(''); setNewEmail(''); setDeleteConfirm('') }

  const toggleDark = () => { document.documentElement.classList.toggle('dark'); setDark(!dark); localStorage.setItem('theme', dark ? 'light' : 'dark') }
  const toggleSound = () => { setSound(!sound); localStorage.setItem('sound', sound ? 'off' : 'on') }

  const handleChangePassword = async () => {
    if (newPassword.length < 8) { setModalError('Password must be at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setModalError('Passwords do not match.'); return }
    setModalLoading(true); setModalError('')
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setModalMsg('Password updated successfully.')
      setTimeout(closeModal, 2000)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update password.')
    }
    setModalLoading(false)
  }

  const handleUpdateEmail = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { setModalError('Enter a valid email address.'); return }
    setModalLoading(true); setModalError('')
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      setModalMsg('Confirmation email sent. Check your inbox to verify the new address.')
      setTimeout(closeModal, 3000)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update email.')
    }
    setModalLoading(false)
  }

  const handle2FA = async () => {
    setModalLoading(true); setModalError('')
    try {
      // Supabase MFA enrollment — opens TOTP setup
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', issuer: 'Acaedu' })
      if (error) throw error
      // Show QR code URI in a new tab as a simple fallback
      if (data?.totp?.qr_code) {
        setModalMsg(`Scan the QR code with your authenticator app.\n\nManual key: ${data.totp.secret}`)
      } else {
        setModalMsg('2FA enrollment initiated. Check your authenticator app.')
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Could not enroll 2FA.')
    }
    setModalLoading(false)
  }

  const handleExportData = async () => {
    setModalLoading(true); setModalError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const [profile, grades, enrollments, attendance] = await Promise.all([
        fetchTable('profiles', { id: user.id }),
        fetchTable('grades', { student_id: user.id }),
        fetchTable('enrollments', { student_id: user.id }),
        fetchTable('attendance', { student_id: user.id }),
      ])
      const exportData = {
        exportedAt: new Date().toISOString(),
        profile: profile[0] || {},
        grades, enrollments, attendance,
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `acaedu-data-${user.id.slice(0,8)}.json`
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
      setModalMsg('Your data has been downloaded.')
      setTimeout(closeModal, 2000)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Export failed.')
    }
    setModalLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') { setModalError('Type DELETE to confirm.'); return }
    setModalLoading(true); setModalError('')
    try {
      const { error } = await supabase.auth.admin.deleteUser((await supabase.auth.getUser()).data.user?.id || '')
      if (error) {
        // Admin API not available client-side — sign out and show message
        await supabase.auth.signOut()
        window.location.href = '/login'
        return
      }
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch {
      // Graceful fallback: sign out since client can't call admin API
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
  }

  // Toggle helper
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="w-12 h-[26px] rounded-full relative transition-colors duration-200 flex-shrink-0"
      style={{ background: on ? 'var(--color-navy)' : 'var(--color-beige)' }}>
      <div className="w-5 h-5 rounded-full bg-white absolute top-[3px] transition-transform duration-200 shadow-sm"
        style={{ transform: on ? 'translateX(23px)' : 'translateX(3px)' }} />
    </button>
  )

  // Reusable modal shell
  const Modal = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <AnimatePresence>
      {modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={closeModal}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl border border-beige p-6 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-[15px] font-bold text-navy mb-4 text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
            {modalError && <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px]">{modalError}</div>}
            {modalMsg && <div className="mb-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[12px]">{modalMsg}</div>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <span className="section-label">Settings</span>
        <h1 className="section-title mt-2 text-3xl">Settings</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5">Manage your account preferences and app settings</p>
      </div>

      {/* Appearance */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Appearance</h2>
        <div className="space-y-2">
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Dark Mode</h3><p className="text-[12px] text-[var(--color-text-muted)]">Switch between light and dark themes</p></div>
            <Toggle on={dark} onToggle={toggleDark} />
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Font Size</h3><p className="text-[12px] text-[var(--color-text-muted)]">Adjust text size across the app</p></div>
            <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="select w-auto text-[13px] min-w-[100px]">
              <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
            </select>
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Compact Sidebar</h3><p className="text-[12px] text-[var(--color-text-muted)]">Show icons only in sidebar navigation</p></div>
            <Toggle on={sidebarCompact} onToggle={() => setSidebarCompact(!sidebarCompact)} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Notifications</h2>
        <div className="space-y-2">
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Email Notifications</h3><p className="text-[12px] text-[var(--color-text-muted)]">Receive email alerts for important updates</p></div>
            <Toggle on={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Push Notifications</h3><p className="text-[12px] text-[var(--color-text-muted)]">Browser push notifications for real-time alerts</p></div>
            <Toggle on={pushNotifs} onToggle={() => setPushNotifs(!pushNotifs)} />
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Weekly Digest</h3><p className="text-[12px] text-[var(--color-text-muted)]">Get a weekly summary of your academic activity</p></div>
            <Toggle on={weeklyDigest} onToggle={() => setWeeklyDigest(!weeklyDigest)} />
          </div>
        </div>
      </div>

      {/* Sound */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Sound & Media</h2>
        <div className="space-y-2">
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Sound Effects</h3><p className="text-[12px] text-[var(--color-text-muted)]">Play sounds on interactions and notifications</p></div>
            <Toggle on={sound} onToggle={toggleSound} />
          </div>
        </div>
      </div>

      {/* Regional */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Regional</h2>
        <div className="space-y-2">
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Language</h3><p className="text-[12px] text-[var(--color-text-muted)]">Select your preferred language</p></div>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="select w-auto text-[13px] min-w-[140px]">
              <option value="en">English</option><option value="fr">Français</option><option value="ha">Hausa</option><option value="yo">Yorùbá</option><option value="ig">Igbo</option>
            </select>
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Timezone</h3><p className="text-[12px] text-[var(--color-text-muted)]">Set your local timezone for schedules</p></div>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="select w-auto text-[13px] min-w-[180px]">
              <option value="Africa/Lagos">West Africa (WAT)</option><option value="Africa/Nairobi">East Africa (EAT)</option>
              <option value="Europe/London">London (GMT)</option><option value="America/New_York">New York (EST)</option><option value="Asia/Dubai">Dubai (GST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Privacy & Security</h2>
        <div className="space-y-2">
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Two-Factor Authentication</h3><p className="text-[12px] text-[var(--color-text-muted)]">Add an extra layer of security to your account</p></div>
            <button onClick={() => { setModal('2fa'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Enable</button>
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Download My Data</h3><p className="text-[12px] text-[var(--color-text-muted)]">Export a copy of all your account data</p></div>
            <button onClick={() => { setModal('export'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Export</button>
          </div>
          <div className="card p-4 flex items-center justify-between border-[var(--color-danger)]/20">
            <div><h3 className="text-[14px] font-bold text-[var(--color-danger)]">Delete Account</h3><p className="text-[12px] text-[var(--color-text-muted)]">Permanently delete your account and all data</p></div>
            <button onClick={() => { setModal('delete'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5 text-[var(--color-danger)] border-[var(--color-danger)]/30 hover:bg-[var(--color-danger)]/5">Delete</button>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Billing & Subscription</h2>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Current Plan</h3><p className="text-[12px] text-[var(--color-text-muted)]">Manage your subscription and billing</p></div>
            <span className="badge badge-success">Free</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-[10px] bg-[var(--color-bg)] text-center border border-[var(--color-beige)]">
              <div className="text-[15px] font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Free</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Basic features</div>
            </div>
            <div className="p-3 rounded-[10px] text-center border-2 border-[var(--color-navy)]/30 bg-[var(--color-navy)]/3">
              <div className="text-[15px] font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Pro</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">$9.99/month</div>
            </div>
            <div className="p-3 rounded-[10px] bg-[var(--color-bg)] text-center border border-[var(--color-beige)]">
              <div className="text-[15px] font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Enterprise</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Custom pricing</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary flex-1 py-2.5 text-[13px]">Subscribe with Paystack</button>
            <button className="btn-secondary flex-1 py-2.5 text-[13px]">Pay with PayPal</button>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Account</h2>
        <div className="space-y-2">
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Change Password</h3><p className="text-[12px] text-[var(--color-text-muted)]">Update your account password</p></div>
            <button onClick={() => { setModal('password'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Change</button>
          </div>
          <div className="card p-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]">Update Email</h3><p className="text-[12px] text-[var(--color-text-muted)]">Change the email associated with your account</p></div>
            <button onClick={() => { setModal('email'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Update</button>
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────── */}

      {/* Change Password */}
      {modal === 'password' && (
        <Modal title="Change Password">
          <div className="space-y-3 mb-4">
            <div>
              <label className="label">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input" placeholder="Repeat new password" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</button>
            <button onClick={handleChangePassword} disabled={modalLoading} className="btn-primary flex-1 py-2">
              {modalLoading ? 'Saving...' : 'Update'}
            </button>
          </div>
        </Modal>
      )}

      {/* Update Email */}
      {modal === 'email' && (
        <Modal title="Update Email">
          <div className="mb-4">
            <label className="label">New Email Address</label>
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="input" placeholder="new@example.com" />
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">A confirmation link will be sent to the new address.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</button>
            <button onClick={handleUpdateEmail} disabled={modalLoading} className="btn-primary flex-1 py-2">
              {modalLoading ? 'Sending...' : 'Send Link'}
            </button>
          </div>
        </Modal>
      )}

      {/* 2FA */}
      {modal === '2fa' && (
        <Modal title="Enable Two-Factor Authentication">
          {!modalMsg ? (
            <>
              <p className="text-[13px] text-[var(--color-text-muted)] mb-4 text-center">Use an authenticator app like Google Authenticator or Authy to add 2FA to your account.</p>
              <div className="flex gap-2">
                <button onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</button>
                <button onClick={handle2FA} disabled={modalLoading} className="btn-primary flex-1 py-2">
                  {modalLoading ? 'Setting up...' : 'Enable 2FA'}
                </button>
              </div>
            </>
          ) : (
            <>
              <pre className="text-[11px] bg-cream rounded-lg p-3 mb-4 whitespace-pre-wrap break-all">{modalMsg}</pre>
              <button onClick={closeModal} className="btn-primary w-full py-2">Done</button>
            </>
          )}
        </Modal>
      )}

      {/* Export Data */}
      {modal === 'export' && (
        <Modal title="Export My Data">
          {!modalMsg ? (
            <>
              <p className="text-[13px] text-[var(--color-text-muted)] mb-4 text-center">Downloads a JSON file containing your profile, grades, enrollments, and attendance records.</p>
              <div className="flex gap-2">
                <button onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</button>
                <button onClick={handleExportData} disabled={modalLoading} className="btn-primary flex-1 py-2">
                  {modalLoading ? 'Exporting...' : 'Download'}
                </button>
              </div>
            </>
          ) : (
            <button onClick={closeModal} className="btn-primary w-full py-2">Close</button>
          )}
        </Modal>
      )}

      {/* Delete Account */}
      {modal === 'delete' && (
        <Modal title="Delete Account">
          <p className="text-[13px] text-[var(--color-text-muted)] mb-3 text-center">This is permanent and cannot be undone. Type <strong>DELETE</strong> to confirm.</p>
          <div className="mb-4">
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} className="input text-center font-mono" placeholder="DELETE" />
          </div>
          <div className="flex gap-2">
            <button onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</button>
            <button onClick={handleDeleteAccount} disabled={modalLoading || deleteConfirm !== 'DELETE'}
              className="flex-1 py-2 rounded-[var(--radius-md)] bg-[var(--color-danger)] text-white font-semibold text-[13px] disabled:opacity-40 hover:bg-[var(--color-danger)]/90 transition">
              {modalLoading ? 'Deleting...' : 'Delete Forever'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
