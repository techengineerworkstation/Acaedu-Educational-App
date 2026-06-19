'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TextReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const words = text.split(' ')

  return (
    <div ref={ref} className={cn('leading-relaxed', className)}>
      {words.map((word, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}>
          {word}
        </motion.span>
      ))}
    </div>
  )
}

export function GlowingEffect({ children, className }: { children: React.ReactNode; className?: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={cn('relative group', className)}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top }) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {isHovered && (
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none rounded-[inherit]"
          style={{ background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(27,58,92,0.15), transparent 60%)` }} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function NumberTicker({ value, className }: { value: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 1500
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])

  return <span ref={ref} className={cn('tabular-nums', className)}>{display}</span>
}
