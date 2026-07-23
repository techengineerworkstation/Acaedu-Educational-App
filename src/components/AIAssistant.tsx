'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, Sparkles, BookOpen, GraduationCap, Loader2, X, MessageSquare } from 'lucide-react'
import { getAcademicAdvice, getCareerAdvice, generateLectureSummary, generateNoteSummary } from '@/lib/groq'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

type AIMode = 'academic' | 'career' | 'summary' | 'notes'

const modeConfig: Record<AIMode, { icon: typeof Brain; label: string; placeholder: string }> = {
  academic: { icon: GraduationCap, label: 'Academic Advisor', placeholder: 'Ask about study strategies, course planning, academic goals...' },
  career:   { icon: Brain, label: 'Career Counselor', placeholder: 'Ask about career paths, skills, internships...' },
  summary:  { icon: BookOpen, label: 'Lecture Summarizer', placeholder: 'Paste lecture content to summarize...' },
  notes:    { icon: Sparkles, label: 'Note Condenser', placeholder: 'Paste your notes for a concise summary...' },
}

function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• (.*$)/gm, '<span class="flex gap-1.5"><span class="text-[var(--color-primary)]">•</span><span>$1</span></span>')
    .replace(/^#{1,3} (.*$)/gm, '<span class="font-bold text-[var(--color-navy)]">$1</span>')
    .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-primary)] text-[11px]">$1</code>')
}

export function AIAssistant({ onClose, defaultMode = 'academic' }: { onClose: () => void; defaultMode?: AIMode }) {
  const [mode, setMode] = useState<AIMode>(defaultMode)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      let response: string
      switch (mode) {
        case 'academic': response = await getAcademicAdvice(userMsg.content); break
        case 'career':   response = await getCareerAdvice(userMsg.content); break
        case 'summary':  response = await generateLectureSummary('Lecture', userMsg.content); break
        case 'notes':    response = await generateNoteSummary(userMsg.content); break
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response!, timestamp: Date.now() }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() }])
    } finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--color-bg-card)] rounded-[16px] border border-[var(--color-border-light)] shadow-2xl flex flex-col overflow-hidden" style={{ height: 'min(600px, 85vh)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Sparkles size={14} className="text-[var(--color-primary)]" />
            </div>
            <span className="text-[13px] font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>AI Assistant</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors"><X size={16} className="text-[var(--color-text-muted)]" /></button>
        </div>
        <div className="flex gap-1 px-3 py-2 border-b border-[var(--color-border-light)] overflow-x-auto">
          {(Object.keys(modeConfig) as AIMode[]).map(m => {
            const cfg = modeConfig[m]; const Icon = cfg.icon
            return (
              <button key={m} onClick={() => { setMode(m); setMessages([]) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  mode === m ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)]'
                }`}>
                <Icon size={12} />{cfg.label}
              </button>
            )
          })}
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--color-primary)]/8 flex items-center justify-center mx-auto mb-3">
                {(() => { const Icon = modeConfig[mode].icon; return <Icon size={18} className="text-[var(--color-primary)]" /> })()}
              </div>
              <p className="text-[12px] text-[var(--color-text-muted)] max-w-xs mx-auto">
                {mode === 'academic' && 'Ask me about study strategies, course planning, time management, or academic goals.'}
                {mode === 'career' && 'Ask me about career paths, skill development, internships, or job market insights.'}
                {mode === 'summary' && 'Paste your lecture content and I\'ll create a structured summary with key points.'}
                {mode === 'notes' && 'Paste your notes and I\'ll condense them into clear, concise takeaways.'}
              </p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                  m.role === 'user' ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] border border-[var(--color-border-light)] rounded-bl-md'
                }`}>
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatAIResponse(m.content) }} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] px-3 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-2">
                <Loader2 size={14} className="text-[var(--color-primary)] animate-spin" />
                <span className="text-[11px] text-[var(--color-text-muted)]">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>
        <div className="px-3 py-3 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-2 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border-light)] px-3 py-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={modeConfig[mode].placeholder}
              className="flex-1 bg-transparent outline-none text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50" disabled={loading} />
            <button onClick={send} disabled={loading || !input.trim()}
              className="p-1.5 rounded-lg bg-[var(--color-primary)] text-white disabled:opacity-40 hover:bg-[var(--color-primary-hover)] transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FloatingAIButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25 flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-colors">
      <MessageSquare size={20} />
    </motion.button>
  )
}
