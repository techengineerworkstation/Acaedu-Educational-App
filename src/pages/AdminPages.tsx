import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, UserCheck, BookOpen } from 'lucide-react'
import { fetchTable } from '../lib/supabase'

export function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [users, courses, enrollments, exams, assignments] = await Promise.all([
          fetchTable('profiles'),
          fetchTable('courses'),
          fetchTable('enrollments'),
          fetchTable('exams'),
          fetchTable('assignments'),
        ])
        setStats({
          users: users.length,
          students: users.filter((u: Record<string, unknown>) => u.role === 'student').length,
          lecturers: users.filter((u: Record<string, unknown>) => u.role === 'lecturer').length,
          courses: courses.length,
          enrollments: enrollments.length,
          exams: exams.length,
          assignments: assignments.length,
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
    { label: 'Active Subjects', value: stats.courses || 0, icon: BookOpen, color: '#6B5CE7' },
  ]

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-1">Admin</div>
        <h1 className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Admin Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({length:4}).map((_,i) => <div key={i} className="h-28 rounded-xl bg-beige/50 animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="p-5 rounded-xl bg-white border border-beige hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{background:`${card.color}10`}}>
                <card.icon size={20} style={{color:card.color}}/>
              </div>
              <div className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{card.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{card.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}} className="p-6 rounded-xl bg-white border border-beige">
          <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-4">Enrollment Trends</div>
          <div className="text-sm text-text-muted">Enrollment analytics will appear here.</div>
        </motion.div>
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4}} className="p-6 rounded-xl bg-white border border-beige">
          <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-4">Revenue Overview</div>
          <div className="text-sm text-text-muted">Revenue analytics will appear here.</div>
        </motion.div>
      </div>
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
          <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-1">User Management</div>
          <h1 className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Users</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition" placeholder="Search users..."/>
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition">
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? <div className="h-32 bg-beige/50 rounded-xl animate-pulse"/> : (
        <div className="bg-white rounded-xl border border-beige overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id as string} className="border-b border-beige/50 hover:bg-cream/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xs">{(u.full_name as string)?.[0] || '?'}</div>
                      <span className="font-medium text-sm text-navy">{u.full_name as string}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{u.email as string}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                      u.role === 'admin' ? 'bg-danger/10 text-danger' :
                      u.role === 'lecturer' ? 'bg-navy/8 text-navy' :
                      'bg-success/10 text-success'
                    }`}>{u.role as string}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{u.created_at ? new Date(u.created_at as string).toLocaleDateString() : ''}</td>
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
          <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-1">Population Census</div>
          <h1 className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Student & Lecturer Directory</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition" placeholder="Search name, email, matric..."/>
          </div>
          <select value={department} onChange={e => setDepartment(e.target.value)} className="px-3 py-2 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition">
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {selectedUser && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-6 rounded-xl bg-white border border-beige">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-2xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{(selectedUser.full_name as string)?.[0]}</div>
              <div>
                <h2 className="text-xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{selectedUser.full_name as string}</h2>
                <p className="text-sm text-text-muted">{selectedUser.email as string}</p>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-navy transition p-2 rounded-lg hover:bg-cream">✕</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Role</div><div className="font-medium text-sm capitalize">{selectedUser.role as string}</div></div>
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Department</div><div className="font-medium text-sm">{(selectedUser.department as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Faculty</div><div className="font-medium text-sm">{(selectedUser.faculty as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Gender</div><div className="font-medium text-sm">{(selectedUser.gender as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Matric No</div><div className="font-medium text-sm font-mono">{(selectedUser.matric_number as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Phone</div><div className="font-medium text-sm">{(selectedUser.phone as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Year</div><div className="font-medium text-sm">{(selectedUser.year_of_study as string) || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted uppercase tracking-wider font-medium">Joined</div><div className="font-medium text-sm">{selectedUser.created_at ? new Date(selectedUser.created_at as string).toLocaleDateString() : ''}</div></div>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-xl border border-beige overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-beige">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Gender</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Matric</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id as string} className="border-b border-beige/50 hover:bg-cream/50 transition cursor-pointer" onClick={() => setSelectedUser(u)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xs">{(u.full_name as string)?.[0] || '?'}</div>
                    <span className="font-medium text-sm text-navy">{u.full_name as string}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">{u.email as string}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                    u.role === 'admin' ? 'bg-danger/10 text-danger' :
                    u.role === 'lecturer' ? 'bg-navy/8 text-navy' :
                    'bg-success/10 text-success'
                  }`}>{u.role as string}</span>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">{(u.department as string) || '-'}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{(u.gender as string) || '-'}</td>
                <td className="px-4 py-3 text-sm text-text-muted font-mono">{(u.matric_number as string) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
