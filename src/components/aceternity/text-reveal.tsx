'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ── TextReveal ─────────────────────────────────────────────── */
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const words = text.split(' ')

  return (
    <div ref={ref} className={cn('leading-relaxed', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.55, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

/* ── GlowingEffect — prismatic mouse-tracking radial ───────── */
export function GlowingEffect({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [gradientAngle, setGradientAngle] = useState(0)
  const angleRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!hovered) return
    const tick = () => {
      angleRef.current = (angleRef.current + 1.2) % 360
      setGradientAngle(angleRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hovered])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative group', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Prismatic border glow */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-0"
          style={{
            background: `linear-gradient(${gradientAngle}deg,
              rgba(74,126,196,0.0),
              rgba(201,164,84,0.12),
              rgba(107,159,212,0.08),
              rgba(232,201,106,0.10),
              rgba(74,126,196,0.0))`,
          }}
        />
      )}
      {/* Mouse-follow spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 z-0 pointer-events-none rounded-[inherit]"
          style={{
            background: `radial-gradient(360px circle at ${mouse.x}px ${mouse.y}px,
              rgba(74,126,196,0.13) 0%,
              rgba(201,164,84,0.07) 45%,
              transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/* ── NumberTicker ───────────────────────────────────────────── */
export function NumberTicker({ value, className }: { value: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(parseFloat((eased * value).toFixed(value % 1 !== 0 ? 1 : 0)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])

  return <span ref={ref} className={cn('tabular-nums', className)}>{display}</span>
}
