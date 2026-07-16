'use client'
import { useEffect, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface Star {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
  twinkleSpeed: number; twinklePhase: number
  color: string
  trail: { x: number; y: number }[]
}

const COLORS = ['#7BAAD4', '#C9A454', '#4A7EC4', '#E8C96A', '#FFFFFF']

export function Sparkles({ count = 55, className }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00018,
      size: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.7 + 0.2,
      twinkleSpeed: 0.6 + Math.random() * 1.4,
      twinklePhase: Math.random() * Math.PI * 2,
      color: COLORS[i % COLORS.length],
      trail: [],
    }))
  }, [count])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animId: number
    let t = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const animate = () => {
      t += 0.016
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      stars.forEach(s => {
        // save trail point (world coords)
        s.trail.push({ x: s.x * w, y: s.y * h })
        if (s.trail.length > 8) s.trail.shift()

        // move
        s.x += s.vx; s.y += s.vy
        if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0
        if (s.y < 0) s.y = 1; if (s.y > 1) s.y = 0

        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase)
        const alpha = s.opacity * (0.4 + 0.6 * twinkle)
        const px = s.x * w
        const py = s.y * h

        // draw trail
        if (s.trail.length > 2) {
          ctx.beginPath()
          ctx.moveTo(s.trail[0].x, s.trail[0].y)
          for (let i = 1; i < s.trail.length; i++) ctx.lineTo(s.trail[i].x, s.trail[i].y)
          ctx.strokeStyle = s.color
          ctx.lineWidth = s.size * 0.4
          ctx.globalAlpha = alpha * 0.25
          ctx.stroke()
        }

        // draw star core
        ctx.beginPath()
        ctx.arc(px, py, s.size * (0.7 + 0.3 * twinkle), 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = alpha
        ctx.fill()

        // soft glow halo
        const halo = ctx.createRadialGradient(px, py, 0, px, py, s.size * 4)
        halo.addColorStop(0, s.color.replace(')', `,${alpha * 0.35})`).replace('rgb', 'rgba').replace('#', 'rgba('))
        halo.addColorStop(1, 'transparent')
        // simple fallback: just a larger soft circle
        ctx.beginPath()
        ctx.arc(px, py, s.size * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = alpha * 0.08
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [stars])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
    />
  )
}
