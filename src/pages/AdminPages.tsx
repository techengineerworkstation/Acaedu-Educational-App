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
          students: users.filter(u => u.role === 'student').length,
          lecturers: users.filter(u => u.role === 'lecturer').length,
          courses: courses.length,
          enrollments: enrollments.length,
          exams: exams.length,
          assignments: assignments.length,
        })
      } catch { }
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Users', value: stats.users || 0, icon: Users, color: '#5B8CC0' },
    { label: 'Students', value: stats.students || 0, icon: UserCheck, color: '#4CAF70' },
    { label: 'Lecturers', value: stats.lecturers || 0, icon: Users, color: '#C9A96E' },
    { label: 'Active Subjects', value: stats.courses || 0, icon: BookOpen, color: '#8B5CF6' },
  ]

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs text-text-muted uppercase tracking-wider mb-1">ADMIN</div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({length:4}).map((_,i) => <div key={i} className="h-28 rounded-2xl bg-bg-secondary animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="p-5 rounded-2xl bg-bg-card border border-border glow-hover" style={{borderTop:`3px solid ${card.color}`}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:`${card.color}15`}}>
                <card.icon size={20} style={{color:card.color}}/>
              </div>
              <div className="text-2xl font-extrabold font-mono" style={{color:card.color}}>{card.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{card.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-4">Enrollment Trends</div>
          <div className="text-sm text-text-muted">Enrollment analytics will appear here.</div>
        </motion.div>
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4}} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-4">Revenue Overview</div>
          <div className="text-sm text-text-muted">Revenue analytics will appear here.</div>
        </motion.div>
      </div>
    </div>
  )
}

export function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => { fetchTable('profiles').then(setUsers).finally(() => setLoading(false)) }, [])

  const filtered = users.filter(u => {
    const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">USER MANAGEMENT</div>
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg border border-border bg-bg outline-none text-sm" placeholder="Search users..."/>
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-bg outline-none text-sm">
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : (
        <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-bg-secondary/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{u.full_name?.[0] || '?'}</div>
                      <span className="font-medium">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      u.role === 'admin' ? 'bg-danger/10 text-danger' :
                      u.role === 'lecturer' ? 'bg-primary/10 text-primary' :
                      'bg-success/10 text-success'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{u.created_at ? new Date(u.created_at).toLocaleDateString() : ''}</td>
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
  const [users, setUsers] = useState<any[]>([])
  const [_, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')

  useEffect(() => { fetchTable('profiles').then(setUsers).finally(() => setLoading(false)) }, [])

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))]

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.matric_number?.toLowerCase().includes(search.toLowerCase())
    const matchDept = department === 'all' || u.department === department
    return matchSearch && matchDept
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">POPULATION CENSUS</div>
          <h1 className="text-2xl font-bold">Student & Lecturer Directory</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
            <input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg border border-border bg-bg outline-none text-sm" placeholder="Search name, email, matric..."/>
          </div>
          <select value={department} onChange={e => setDepartment(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-bg outline-none text-sm">
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {selectedUser && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-6 rounded-2xl bg-bg-card border border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">{selectedUser.full_name?.[0]}</div>
              <div>
                <h2 className="text-xl font-bold">{selectedUser.full_name}</h2>
                <p className="text-sm text-text-muted">{selectedUser.email}</p>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-primary transition">✕</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div className="text-xs text-text-muted">Role</div><div className="font-medium capitalize">{selectedUser.role}</div></div>
            <div><div className="text-xs text-text-muted">Department</div><div className="font-medium">{selectedUser.department || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted">Faculty</div><div className="font-medium">{selectedUser.faculty || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted">Gender</div><div className="font-medium">{selectedUser.gender || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted">Matric No</div><div className="font-medium font-mono">{selectedUser.matric_number || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted">Phone</div><div className="font-medium">{selectedUser.phone || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted">Year</div><div className="font-medium">{selectedUser.year_of_study || 'N/A'}</div></div>
            <div><div className="text-xs text-text-muted">Joined</div><div className="font-medium">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : ''}</div></div>
          </div>
        </motion.div>
      )}

      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Department</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Gender</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase">Matric</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-bg-secondary/50 transition cursor-pointer" onClick={() => setSelectedUser(u)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{u.full_name?.[0] || '?'}</div>
                    <span className="font-medium">{u.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    u.role === 'admin' ? 'bg-danger/10 text-danger' :
                    u.role === 'lecturer' ? 'bg-primary/10 text-primary' :
                    'bg-success/10 text-success'
                  }`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">{u.department || '-'}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{u.gender || '-'}</td>
                <td className="px-4 py-3 text-sm text-text-muted font-mono">{u.matric_number || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
