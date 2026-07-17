import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { Users, Search, UserCheck, BookOpen, CreditCard, GraduationCap } from 'lucide-react'
import { fetchTable } from '../lib/supabase'

// ── Shared chart helpers (scoped to AdminPages) ───────────────

function AdminBarChart({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div ref={ref} className="flex items-end gap-2 h-36 px-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-[var(--color-navy)]">{d.value}</span>
          <div className="w-full rounded-t-[4px] overflow-hidden"
            style={{ height: isInView ? `${(d.value / max) * 100}%` : '0%', background: colors[i % colors.length], transition: `height 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s` }} />
          <span className="text-[9px] text-[var(--color-text-muted)] text-center leading-tight">{d.label}</span>
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
        <div className="absolute rounded-full bg-[var(--color-bg-card)] flex items-center justify-center"
          style={{ width: size * 0.55, height: size * 0.55, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <span className="text-sm font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{total}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-[10px] text-[var(--color-text-muted)]">{seg.label}</span>
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
    { label: 'Total Users', value: stats.users || 0, icon: Users, color: '#1B3A5C' },
    { label: 'Students', value: stats.students || 0, icon: UserCheck, color: '#3D8B60' },
    { label: 'Lecturers', value: stats.lecturers || 0, icon: Users, color: '#B8976A' },
    { label: 'Active Courses', value: stats.courses || 0, icon: BookOpen, color: '#6B5CE7' },
    { label: 'Enrollments', value: stats.enrollments || 0, icon: GraduationCap, color: '#2A5580' },
    { label: 'Exams', value: stats.exams || 0, icon: BookOpen, color: '#C49840' },
    { label: 'Assignments', value: stats.assignments || 0, icon: BookOpen, color: '#C44040' },
    { label: 'Revenue (₦)', value: stats.totalRevenue || 0, icon: CreditCard, color: '#3D8B60' },
  ]

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">Admin</div>
        <h1 className="text-2xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Admin Dashboard</h1>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({length: 8}).map((_,i) => <div key={i} className="h-28 rounded-xl bg-[var(--color-beige)]/50 animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              className="p-5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{background:`${card.color}15`}}>
                <card.icon size={20} style={{color:card.color}}/>
              </div>
              <div className="text-2xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <AnimatedStat value={card.value} />
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1 uppercase tracking-wider font-medium">{card.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Enrollment Trends bar chart */}
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}}
          className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">Enrollment Trends</div>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Breakdown by status</p>
          {loading ? <div className="h-36 bg-[var(--color-beige)]/50 rounded-lg animate-pulse"/> : (
            <AdminBarChart
              data={[
                { label: 'Active', value: stats.activeEnrollments || 0 },
                { label: 'Completed', value: stats.completedEnrollments || 0 },
                { label: 'Dropped', value: stats.droppedEnrollments || 0 },
                { label: 'Courses', value: stats.courses || 0 },
                { label: 'Exams', value: stats.exams || 0 },
                { label: 'Assignments', value: stats.assignments || 0 },
              ]}
              colors={['#3D8B60', '#6B5CE7', '#C44040', '#1B3A5C', '#B8976A', '#C49840']}
            />
          )}
        </motion.div>

        {/* Revenue / Payments pie chart */}
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4}}
          className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex flex-col">
          <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">Revenue Overview</div>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Payment status distribution</p>
          {loading ? <div className="h-36 bg-[var(--color-beige)]/50 rounded-lg animate-pulse"/> : (
            <div className="flex-1 flex items-center justify-center">
              <AdminPieChart
                segments={[
                  { value: stats.completedPayments || 0, color: '#3D8B60', label: 'Completed' },
                  { value: stats.pendingPayments || 0, color: '#C49840', label: 'Pending' },
                  { value: Math.max((stats.enrollments || 0) - (stats.completedPayments || 0) - (stats.pendingPayments || 0), 0), color: '#E2DDD5', label: 'No Payment' },
                ]}
                size={130}
              />
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">Total Revenue</span>
            <span className="text-sm font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              ₦{(stats.totalRevenue || 0).toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* User role distribution */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
        className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
        <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">User Distribution</div>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Breakdown by role</p>
        {loading ? <div className="h-36 bg-[var(--color-beige)]/50 rounded-lg animate-pulse"/> : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <AdminPieChart
              segments={[
                { value: stats.students || 0, color: '#1B3A5C', label: 'Students' },
                { value: stats.lecturers || 0, color: '#B8976A', label: 'Lecturers' },
                { value: stats.admins || 0, color: '#C44040', label: 'Admins' },
              ]}
              size={140}
            />
            <div className="flex-1 grid grid-cols-3 gap-4 w-full">
              {[
                { label: 'Students', value: stats.students || 0, color: '#1B3A5C' },
                { label: 'Lecturers', value: stats.lecturers || 0, color: '#B8976A' },
                { label: 'Admins', value: stats.admins || 0, color: '#C44040' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-[var(--color-cream)] text-center">
                  <div className="text-2xl font-extrabold" style={{ color: item.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <AnimatedStat value={item.value} />
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">{item.label}</div>
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
          <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">User Management</div>
          <h1 className="text-2xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Users</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition" placeholder="Search users..."/>
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition">
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? <div className="h-32 bg-[var(--color-beige)]/50 rounded-xl animate-pulse"/> : (
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id as string} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-cream)]/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-navy)]/10 flex items-center justify-center text-[var(--color-navy)] font-bold text-xs">{(u.full_name as string)?.[0] || '?'}</div>
                      <span className="font-medium text-sm text-[var(--color-navy)]">{u.full_name as string}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{u.email as string}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                      u.role === 'admin' ? 'bg-danger/10 text-[var(--color-danger)]' :
                      u.role === 'lecturer' ? 'bg-[var(--color-navy)]/8 text-[var(--color-navy)]' :
                      'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                    }`}>{u.role as string}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{u.created_at ? new Date(u.created_at as string).toLocaleDateString() : ''}</td>
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
          <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">Population Census</div>
          <h1 className="text-2xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Student & Lecturer Directory</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition" placeholder="Search name, email, matric..."/>
          </div>
          <select value={department} onChange={e => setDepartment(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition">
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {selectedUser && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-navy)]/10 flex items-center justify-center text-[var(--color-navy)] font-bold text-2xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{(selectedUser.full_name as string)?.[0]}</div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{selectedUser.full_name as string}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{selectedUser.email as string}</p>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition p-2 rounded-lg hover:bg-[var(--color-cream)]">✕</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Role</div><div className="font-medium text-sm capitalize">{selectedUser.role as string}</div></div>
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Department</div><div className="font-medium text-sm">{(selectedUser.department as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Faculty</div><div className="font-medium text-sm">{(selectedUser.faculty as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Gender</div><div className="font-medium text-sm">{(selectedUser.gender as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Matric No</div><div className="font-medium text-sm font-mono">{(selectedUser.matric_number as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Phone</div><div className="font-medium text-sm">{(selectedUser.phone as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Year</div><div className="font-medium text-sm">{(selectedUser.year_of_study as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Joined</div><div className="font-medium text-sm">{selectedUser.created_at ? new Date(selectedUser.created_at as string).toLocaleDateString() : ''}</div></div>
          </div>
        </motion.div>
      )}

      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Department</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Gender</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Matric</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id as string} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-cream)]/50 transition cursor-pointer" onClick={() => setSelectedUser(u)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-navy)]/10 flex items-center justify-center text-[var(--color-navy)] font-bold text-xs">{(u.full_name as string)?.[0] || '?'}</div>
                    <span className="font-medium text-sm text-[var(--color-navy)]">{u.full_name as string}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{u.email as string}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                    u.role === 'admin' ? 'bg-danger/10 text-[var(--color-danger)]' :
                    u.role === 'lecturer' ? 'bg-[var(--color-navy)]/8 text-[var(--color-navy)]' :
                    'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                  }`}>{u.role as string}</span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{(u.department as string) || '-'}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{(u.gender as string) || '-'}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-muted)] font-mono">{(u.matric_number as string) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
