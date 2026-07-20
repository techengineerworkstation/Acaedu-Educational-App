import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { Users, Search, UserCheck, BookOpen, CreditCard, GraduationCap } from 'lucide-react'
import { fetchTable } from '../lib/supabase'
import { usePresetPalette } from '../lib/theme'

function AdminBarChart({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div ref={ref} className="flex items-end gap-2 h-36 px-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold" style={{ color: 'var(--color-navy)' }}>{d.value}</span>
          <div className="w-full rounded-t-[4px] overflow-hidden"
            style={{ height: isInView ? `${(d.value / max) * 100}%` : '0%', background: colors[i % colors.length], transition: `height 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s` }} />
          <span className="text-[9px] text-center leading-tight" style={{ color: 'var(--color-text-muted)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function AdminPieChart({ segments, size = 120 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  let cumulative = 0
  const gradients = segments.map(seg => {
    const start = (cumulative / total) * 360
    cumulative += seg.value
    const end = (cumulative / total) * 360
    return `${seg.color} ${start}deg ${end}deg`
  })
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-full relative" style={{ width: size, height: size, background: `conic-gradient(${gradients.join(', ')})` }}>
        <div className="absolute rounded-full flex items-center justify-center"
          style={{ width: size * 0.55, height: size * 0.55, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--color-bg-card)' }}>
          <span className="text-sm font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>{total}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimatedStat({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current
      const controls = animate(0, value, {
        duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        onUpdate(v) { node.textContent = Math.round(v).toString() },
      })
      return () => controls.stop()
    }
  }, [isInView, value])
  return <span ref={ref}>0</span>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const palette = usePresetPalette()

  useEffect(() => {
    async function load() {
      try {
        const [users, courses, enrollments, exams, assignments, payments] = await Promise.all([
          fetchTable('profiles'),
          fetchTable('courses'),
          fetchTable('enrollments'),
          fetchTable('exams'),
          fetchTable('assignments'),
          fetchTable('payments'),
        ])
        const activeEnrollments = enrollments.filter((e: Record<string, unknown>) => e.status === 'active').length
        const completedEnrollments = enrollments.filter((e: Record<string, unknown>) => e.status === 'completed').length
        const droppedEnrollments = enrollments.filter((e: Record<string, unknown>) => e.status === 'dropped').length
        const totalRevenue = payments.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.amount as number) || 0), 0)
        const completedPayments = payments.filter((p: Record<string, unknown>) => p.status === 'completed').length
        const pendingPayments = payments.filter((p: Record<string, unknown>) => p.status === 'pending').length
        setStats({
          users: users.length,
          students: users.filter((u: Record<string, unknown>) => u.role === 'student').length,
          lecturers: users.filter((u: Record<string, unknown>) => u.role === 'lecturer').length,
          admins: users.filter((u: Record<string, unknown>) => u.role === 'admin').length,
          courses: courses.length,
          enrollments: enrollments.length,
          activeEnrollments,
          completedEnrollments,
          droppedEnrollments,
          exams: exams.length,
          assignments: assignments.length,
          totalRevenue: Math.round(totalRevenue),
          completedPayments,
          pendingPayments,
        })
      } catch { /* empty */ }
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Users', value: stats.users || 0, icon: Users, color: palette.navy },
    { label: 'Students', value: stats.students || 0, icon: UserCheck, color: palette.success },
    { label: 'Lecturers', value: stats.lecturers || 0, icon: Users, color: palette.gold },
    { label: 'Active Subjects', value: stats.courses || 0, icon: BookOpen, color: palette.accent },
    { label: 'Enrollments', value: stats.enrollments || 0, icon: GraduationCap, color: palette.primary },
    { label: 'Exams', value: stats.exams || 0, icon: BookOpen, color: palette.success },
    { label: 'Assignments', value: stats.assignments || 0, icon: BookOpen, color: palette.danger },
    { label: 'Revenue (N)', value: stats.totalRevenue || 0, icon: CreditCard, color: palette.gold },
  ]

  const barColors = [palette.success, palette.accent, palette.danger, palette.navy, palette.gold, palette.success]

  return (
    <div>
      <div className="mb-6">
        <span className="section-label">Admin</span>
        <h1 className="section-title mt-1">Admin Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({length: 8}).map((_,i) => <div key={i} className="skeleton h-28"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
              className="card p-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: palette.rgba(card.color, 0.1) }}>
                <card.icon size={20} style={{color:card.color}}/>
              </div>
              <div className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
                <AnimatedStat value={card.value} />
              </div>
              <div className="text-xs mt-1 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>{card.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}}
          className="card p-6">
          <span className="section-label">Enrollment Trends</span>
          <h2 className="text-lg font-bold mt-1 mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>Enrollment Trends</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Breakdown by status</p>
          {loading ? <div className="skeleton h-36"/> : (
            <AdminBarChart
              data={[
                { label: 'Active', value: stats.activeEnrollments || 0 },
                { label: 'Completed', value: stats.completedEnrollments || 0 },
                { label: 'Dropped', value: stats.droppedEnrollments || 0 },
                { label: 'Subjects', value: stats.courses || 0 },
                { label: 'Exams', value: stats.exams || 0 },
                { label: 'Assignments', value: stats.assignments || 0 },
              ]}
              colors={barColors}
            />
          )}
        </motion.div>

        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4}}
          className="card p-6 flex flex-col">
          <span className="section-label">Revenue Overview</span>
          <h2 className="text-lg font-bold mt-1 mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>Revenue Overview</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Payment status distribution</p>
          {loading ? <div className="skeleton h-36"/> : (
            <div className="flex-1 flex items-center justify-center">
              <AdminPieChart
                segments={[
                  { value: stats.completedPayments || 0, color: palette.success, label: 'Completed' },
                  { value: stats.pendingPayments || 0, color: palette.gold, label: 'Pending' },
                  { value: Math.max((stats.enrollments || 0) - (stats.completedPayments || 0) - (stats.pendingPayments || 0), 0), color: 'var(--color-border)', label: 'No Payment' },
                ]}
                size={130}
              />
            </div>
          )}
          <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total Revenue</span>
            <span className="text-sm font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
              N{(stats.totalRevenue || 0).toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
        className="card p-6">
        <span className="section-label">User Distribution</span>
        <h2 className="text-lg font-bold mt-1 mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>User Distribution</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Breakdown by role</p>
        {loading ? <div className="skeleton h-36"/> : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <AdminPieChart
              segments={[
                { value: stats.students || 0, color: palette.navy, label: 'Students' },
                { value: stats.lecturers || 0, color: palette.gold, label: 'Lecturers' },
                { value: stats.admins || 0, color: palette.danger, label: 'Admins' },
              ]}
              size={140}
            />
            <div className="flex-1 grid grid-cols-3 gap-4 w-full">
              {[
                { label: 'Students', value: stats.students || 0, color: palette.navy },
                { label: 'Lecturers', value: stats.lecturers || 0, color: palette.gold },
                { label: 'Admins', value: stats.admins || 0, color: palette.danger },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg text-center" style={{ background: 'var(--color-cream)' }}>
                  <div className="text-2xl font-extrabold" style={{ color: item.color, fontFamily: 'var(--font-display)' }}>
                    <AnimatedStat value={item.value} />
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export function UserManagementPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => { fetchTable('profiles').then(setUsers).finally(() => setLoading(false)) }, [])

  const filtered = users.filter(u => {
    const matchSearch = !search || (u.full_name as string)?.toLowerCase().includes(search.toLowerCase()) || (u.email as string)?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">User Management</span>
          <h1 className="section-title mt-1">Users</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" placeholder="Search users..."/>
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="select w-auto">
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? <div className="skeleton h-32"/> : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id as string}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{ background: 'color-mix(in srgb, var(--color-navy) 10%, transparent)', color: 'var(--color-navy)' }}>
                        {(u.full_name as string)?.[0] || '?'}
                      </div>
                      <span className="font-medium text-sm" style={{ color: 'var(--color-navy)' }}>{u.full_name as string}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{u.email as string}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'admin' ? 'badge-danger' :
                      u.role === 'lecturer' ? 'badge-navy' :
                      'badge-success'
                    }`}>{u.role as string}</span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{u.created_at ? new Date(u.created_at as string).toLocaleDateString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function PopulationCensusPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([])
  const [, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')

  useEffect(() => { fetchTable('profiles').then(setUsers).finally(() => setLoading(false)) }, [])

  const departments = [...new Set(users.map(u => u.department as string).filter(Boolean))]

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      (u.full_name as string)?.toLowerCase().includes(search.toLowerCase()) ||
      (u.email as string)?.toLowerCase().includes(search.toLowerCase()) ||
      (u.matric_number as string)?.toLowerCase().includes(search.toLowerCase())
    const matchDept = department === 'all' || u.department === department
    return matchSearch && matchDept
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">Population Census</span>
          <h1 className="section-title mt-1">Student & Lecturer Directory</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" placeholder="Search name, email, matric..."/>
          </div>
          <select value={department} onChange={e => setDepartment(e.target.value)} className="select w-auto">
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {selectedUser && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card mb-6 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl"
                style={{ background: 'color-mix(in srgb, var(--color-navy) 10%, transparent)', color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
                {(selectedUser.full_name as string)?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>{selectedUser.full_name as string}</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{selectedUser.email as string}</p>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="btn-ghost p-2">X</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div className="data-label">Role</div><div className="text-sm font-medium capitalize">{selectedUser.role as string}</div></div>
            <div><div className="data-label">Department</div><div className="text-sm font-medium">{(selectedUser.department as string) || 'N/A'}</div></div>
            <div><div className="data-label">Faculty</div><div className="text-sm font-medium">{(selectedUser.faculty as string) || 'N/A'}</div></div>
            <div><div className="data-label">Gender</div><div className="text-sm font-medium">{(selectedUser.gender as string) || 'N/A'}</div></div>
            <div><div className="data-label">Matric No</div><div className="text-sm font-medium font-mono">{(selectedUser.matric_number as string) || 'N/A'}</div></div>
            <div><div className="data-label">Phone</div><div className="text-sm font-medium">{(selectedUser.phone as string) || 'N/A'}</div></div>
            <div><div className="data-label">Year</div><div className="text-sm font-medium">{(selectedUser.year_of_study as string) || 'N/A'}</div></div>
            <div><div className="data-label">Joined</div><div className="text-sm font-medium">{selectedUser.created_at ? new Date(selectedUser.created_at as string).toLocaleDateString() : ''}</div></div>
          </div>
        </motion.div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Matric</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id as string} className="cursor-pointer" onClick={() => setSelectedUser(u)}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{ background: 'color-mix(in srgb, var(--color-navy) 10%, transparent)', color: 'var(--color-navy)' }}>
                      {(u.full_name as string)?.[0] || '?'}
                    </div>
                    <span className="font-medium text-sm" style={{ color: 'var(--color-navy)' }}>{u.full_name as string}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }}>{u.email as string}</td>
                <td>
                  <span className={`badge ${
                    u.role === 'admin' ? 'badge-danger' :
                    u.role === 'lecturer' ? 'badge-navy' :
                    'badge-success'
                  }`}>{u.role as string}</span>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }}>{(u.department as string) || '-'}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{(u.gender as string) || '-'}</td>
                <td className="font-mono" style={{ color: 'var(--color-text-muted)' }}>{(u.matric_number as string) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
