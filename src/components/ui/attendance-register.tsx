import { useState } from 'react'
import { Check, X, Clock, UserCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Student {
  id: string
  full_name: string
  matric_number?: string
  avatar_url?: string
}

interface AttendanceRecord {
  student_id: string
  status: 'present' | 'absent' | 'late' | 'excused'
}

interface Props {
  students: Student[]
  courseId: string
  scheduleId?: string
  lectureDate: string
  markedBy: string
  existingRecords?: AttendanceRecord[]
  onSaved?: () => void
}

const statusConfig = {
  present: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: Check, label: 'Present' },
  absent: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: X, label: 'Absent' },
  late: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock, label: 'Late' },
  excused: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: UserCheck, label: 'Excused' },
}

export function AttendanceRegister({ students, courseId, scheduleId, lectureDate, markedBy, existingRecords = [], onSaved }: Props) {
  const [records, setRecords] = useState<Record<string, AttendanceRecord['status']>>(() => {
    const initial: Record<string, string> = {}
    existingRecords.forEach(r => { initial[r.student_id] = r.status })
    return initial as Record<string, AttendanceRecord['status']>
  })
  const [saving, setSaving] = useState(false)

  const setStudentStatus = (studentId: string, status: AttendanceRecord['status']) => {
    setRecords(prev => ({ ...prev, [studentId]: status }))
  }

  const markAllPresent = () => {
    const all: Record<string, AttendanceRecord['status']> = {}
    students.forEach(s => { all[s.id] = 'present' })
    setRecords(all)
  }

  const saveAttendance = async () => {
    setSaving(true)
    try {
      const recordsToSave = students.map(s => ({
        student_id: s.id,
        course_id: courseId,
        schedule_id: scheduleId || null,
        lecture_date: lectureDate,
        status: records[s.id] || 'absent',
        marked_by: markedBy,
        marked_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('attendance')
        .upsert(recordsToSave, { onConflict: 'student_id,course_id,lecture_date' })
      if (error) throw error
      onSaved?.()
    } catch (err) {
      console.error('Failed to save attendance:', err)
    } finally {
      setSaving(false)
    }
  }

  const presentCount = Object.values(records).filter(r => r === 'present').length
  const lateCount = Object.values(records).filter(r => r === 'late').length

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
        <div className="flex items-center gap-4 text-[12px]">
          <span className="text-white/50">Total: <span className="text-white/80 font-semibold">{students.length}</span></span>
          <span className="text-green-400/60">Present: <span className="font-semibold">{presentCount}</span></span>
          <span className="text-yellow-400/60">Late: <span className="font-semibold">{lateCount}</span></span>
          <span className="text-red-400/60">Absent: <span className="font-semibold">{students.length - presentCount - lateCount}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllPresent} className="text-[11px] px-3 py-1.5 bg-white/5 rounded-lg text-white/50 hover:bg-white/10 transition-colors">
            All Present
          </button>
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="text-[11px] px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Student list */}
      <div className="space-y-1">
        {students.map(student => {
          const currentStatus = records[student.id]
          return (
            <div key={student.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] transition-colors">
              {student.avatar_url ? (
                <img src={student.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] text-white/40 font-semibold">
                  {student.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white/80 font-medium truncate">{student.full_name}</p>
                {student.matric_number && <p className="text-[11px] text-white/30">{student.matric_number}</p>}
              </div>
              <div className="flex items-center gap-1">
                {(Object.keys(statusConfig) as Array<AttendanceRecord['status']>).map(status => {
                  const config = statusConfig[status]
                  const Icon = config.icon
                  const isActive = currentStatus === status
                  return (
                    <button
                      key={status}
                      onClick={() => setStudentStatus(student.id, status)}
                      className={`p-2 rounded-lg border transition-all ${
                        isActive ? config.color : 'border-transparent bg-white/5 text-white/30 hover:bg-white/10'
                      }`}
                      title={config.label}
                    >
                      <Icon size={14} />
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
