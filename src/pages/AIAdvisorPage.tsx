'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Brain, BookOpen, Sparkles, Send, Loader2 } from 'lucide-react'
import { getAcademicAdvice, getCareerAdvice, generateLectureSummary, generateNoteSummary } from '../lib/groq'
import type { User } from '../types'

type AIMode = 'academic' | 'career' | 'summary' | 'notes'

const modes = [
  { key: 'academic' as AIMode, icon: GraduationCap, label: 'Academic Advice', desc: 'Study strategies, course planning, time management' },
  { key: 'career' as AIMode, icon: Brain, label: 'Career Guidance', desc: 'Career paths, skills, internships, job market' },
  { key: 'summary' as AIMode, icon: BookOpen, label: 'Lecture Summary', desc: 'Paste lecture content for structured notes' },
  { key: 'notes' as AIMode, icon: Sparkles, label: 'Note Condenser', desc: 'Condense your notes into key takeaways' },
]

interface Message { role: 'user' | 'assistant'; content: string }

export function AIAdvisorPage({ user }: { user: User }) {
  const [mode, setMode] = useState<AIMode>('academic')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)
    try {
      let response: string
      switch (mode) {
        case 'academic': response = await getAcademicAdvice(userMsg, `Role: ${user.role}, Name: ${user.full_name}`); break
        case 'career': response = await getCareerAdvice(userMsg); break
        case 'summary': response = await generateLectureSummary('Lecture', userMsg); break
        case 'notes': response = await generateNoteSummary(userMsg); break
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response! }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }])
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <span className="section-label">AI Tools</span>
        <span className="rule-gold" />
        <h1 className="text-display-sm mt-3">AI Advisor</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1">Get personalized academic and career guidance powered by AI</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {modes.map(m => {
          const Icon = m.icon
          return (
            <motion.button key={m.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setMode(m.key); setMessages([]) }}
              className={`p-4 rounded-[14px] border text-left transition-all ${
                mode === m.key ? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 shadow-sm'
                  : 'border-[var(--color-border-light)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-strong)]'
              }`}>
              <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-2 ${
                mode === m.key ? 'bg-[var(--color-primary)]/10' : 'bg-[var(--color-bg-secondary)]'
              }`}>
                <Icon size={17} className={mode === m.key ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
              </div>
              <div className={`text-[13px] font-bold ${mode === m.key ? 'text-[var(--color-primary)]' : 'text-[var(--color-navy)]'}`}
                style={{ fontFamily: 'var(--font-display)' }}>{m.label}</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{m.desc}</div>
            </motion.button>
          )
        })}
      </div>

      <div className="rounded-[14px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="h-[400px] overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-[14px] bg-[var(--color-primary)]/8 flex items-center justify-center mx-auto mb-3">
                {(() => { const Icon = modes.find(m => m.key === mode)!.icon; return <Icon size={20} className="text-[var(--color-primary)]" /> })()}
              </div>
              <p className="text-[13px] text-[var(--color-text-muted)] max-w-sm mx-auto">
                {mode === 'academic' && 'Ask about study strategies, course planning, time management, or academic goals.'}
                {mode === 'career' && 'Ask about career paths, skill development, internships, or industry insights.'}
                {mode === 'summary' && 'Paste your lecture content and I\'ll create a structured summary with key points.'}
                {mode === 'notes' && 'Paste your notes and I\'ll condense them into clear, concise takeaways.'}
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                m.role === 'user' ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] border border-[var(--color-border-light)] rounded-bl-md'
              }`}>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                  __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^• (.*$)/gm, '<span class="flex gap-1.5"><span class="text-[var(--color-primary)]">•</span><span>$1</span></span>')
                }} />
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                <Loader2 size={14} className="text-[var(--color-primary)] animate-spin" />
                <span className="text-[12px] text-[var(--color-text-muted)]">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-2 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border-light)] px-4 py-2.5">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={mode === 'academic' ? 'Ask about study strategies, courses...' : mode === 'career' ? 'Ask about career paths...' : 'Paste content here...'}
              className="flex-1 bg-transparent outline-none text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50" disabled={loading} />
            <button onClick={send} disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-[var(--color-primary)] text-white disabled:opacity-40 hover:bg-[var(--color-primary-hover)] transition-colors">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
