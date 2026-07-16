'use client'
import { useEffect, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface Particle {
  x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string
}

export function Sparkles({ count = 40, className }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const particles = useMemo(() => {
    const arr: Particle[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random(), y: Math.random(),
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.002,
        speedY: (Math.random() - 0.5) * 0.002,
        opacity: Math.random(),
        color: Math.random() > 0.5 ? '#B8976A' : '#1B3A5C',
      })
    }
    return arr
  }, [count])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += (Math.random() - 0.5) * 0.02
        p.opacity = Math.max(0.1, Math.min(1, p.opacity))
        if (p.x < 0 || p.x > 1) p.speedX *= -1
        if (p.y < 0 || p.y > 1) p.speedY *= -1

        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity * 0.6
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize) }
  }, [particles])

  return <canvas ref={canvasRef} className={cn('absolute inset-0 w-full h-full pointer-events-none', className)} />
}
