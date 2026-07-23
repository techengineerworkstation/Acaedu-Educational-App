'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Loader2, Phone } from 'lucide-react'
import { getAcademicAdvice } from '@/lib/groq'

interface ChatMsg { role: 'user' | 'assistant'; content: string }

export function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'chat' | 'whatsapp' | 'telegram'>('chat')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: 'Hi! I\'m the Acaedu AI assistant. How can I help you today? I can answer questions about our platform, features, pricing, or anything else.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const response = await getAcademicAdvice(
        userMsg,
        'You are the Acaedu support assistant. Acaedu is an AI-powered academic LMS platform for schools, universities, and colleges. It offers: subject management, grade analytics, smart scheduling, live collaboration, AI summaries, attendance tracking, exam management, notifications, billing, and role-based access (admin, lecturer, student). Pricing: Free tier, Pro ₦15,000/mo, Enterprise custom. Contact: Chinedu Daniel Ebirim, Email: DanielEbirim25@gmail.com, WhatsApp: +2349115899245, Lekki, Lagos, Nigeria. Be helpful and concise.'
      )
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble right now. Please try WhatsApp or Telegram for immediate support.' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/30 flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-colors">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-[90] w-[360px] max-w-[calc(100vw-48px)] rounded-[18px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: 'calc(100vh - 140px)' }}>
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><MessageCircle size={16} /></div>
                  <div>
                    <div className="text-[13px] font-bold">Acaedu Support</div>
                    <div className="text-[10px] text-white/60">AI-powered assistant</div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={16} /></button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] flex-shrink-0">
              {[
                { key: 'chat' as const, label: 'AI Chat', icon: MessageCircle },
                { key: 'whatsapp' as const, label: 'WhatsApp', icon: Phone },
                { key: 'telegram' as const, label: 'Telegram', icon: Send },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-all ${
                    tab === t.key ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-[var(--color-bg-card)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}>
                  <t.icon size={12} />{t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            {tab === 'chat' ? (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
                  {messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
                        m.role === 'user' ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                          : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] border border-[var(--color-border-light)] rounded-bl-md'
                      }`}>
                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] px-3 py-2 rounded-2xl rounded-bl-md flex items-center gap-2">
                        <Loader2 size={12} className="text-[var(--color-primary)] animate-spin" />
                        <span className="text-[10px] text-[var(--color-text-muted)]">Thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="px-3 py-2.5 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] flex-shrink-0">
                  <div className="flex items-center gap-2 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border-light)] px-3 py-1.5">
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-transparent outline-none text-[12px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50" disabled={loading} />
                    <button onClick={send} disabled={loading || !input.trim()}
                      className="p-1.5 rounded-lg bg-[var(--color-primary)] text-white disabled:opacity-40 hover:bg-[var(--color-primary-hover)] transition-colors">
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </>
            ) : tab === 'whatsapp' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-4"><Phone size={28} className="text-[#25D366]" /></div>
                <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Chat on WhatsApp</h3>
                <p className="text-[12px] text-[var(--color-text-muted)] mb-5 max-w-xs">Get instant support from our team via WhatsApp. Available Mon-Fri, 9AM-6PM WAT.</p>
                <a href="https://wa.me/2349115899245?text=Hello%20Acaedu%20Support" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-[10px] bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1da851] transition-colors shadow-lg shadow-[#25D366]/20">Open WhatsApp</a>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-4">Chinedu Daniel Ebirim · +234 911 589 9245</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#0088cc]/10 flex items-center justify-center mb-4"><Send size={28} className="text-[#0088cc]" /></div>
                <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Chat on Telegram</h3>
                <p className="text-[12px] text-[var(--color-text-muted)] mb-5 max-w-xs">Reach us on Telegram for quick questions, updates, and community support.</p>
                <a href="https://t.me/acaedu" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-[10px] bg-[#0088cc] text-white text-[13px] font-semibold hover:bg-[#006da3] transition-colors shadow-lg shadow-[#0088cc]/20">Open Telegram</a>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-4">@acaedu · Lekki, Lagos</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
