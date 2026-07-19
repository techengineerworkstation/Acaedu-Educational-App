'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function CardContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('py-3 [perspective:1200px]', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className, style: externalStyle }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
  })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -10
    const rotateY = ((x - cx) / cx) *  10
    setStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`,
      transition: 'transform 0.1s ease-out',
    })
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    })
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn('[transform-style:preserve-3d] relative', className)}
      style={{ ...style, ...externalStyle }}
    >
      {/* Depth shine layer */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-20"
          style={{
            background: `radial-gradient(280px circle at ${glowPos.x}% ${glowPos.y}%,
              var(--color-primary-glow, rgba(255,255,255,0.08)) 0%,
              transparent 65%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}
      {children}
    </motion.div>
  )
}
