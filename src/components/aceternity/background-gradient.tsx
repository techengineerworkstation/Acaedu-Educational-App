'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export function BackgroundGradient({ children, className }: { children: React.ReactNode; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const drawOrb = (
      cx: number, cy: number, r: number,
      r0: number, g0: number, b0: number, a0: number
    ) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      g.addColorStop(0,   `rgba(${r0},${g0},${b0},${a0})`)
      g.addColorStop(0.5, `rgba(${r0},${g0},${b0},${a0 * 0.4})`)
      g.addColorStop(1,   'transparent')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    }

    const animate = () => {
      time += 0.004
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // Navy aurora orb — top-left drift
      drawOrb(
        w * (0.25 + Math.sin(time * 0.7) * 0.12),
        h * (0.30 + Math.cos(time * 0.5) * 0.12),
        w * 0.55, 15, 45, 92, 0.18
      )
      // Gold aurora orb — bottom-right drift
      drawOrb(
        w * (0.75 + Math.cos(time * 0.6) * 0.10),
        h * (0.65 + Math.sin(time * 0.4) * 0.10),
        w * 0.45, 201, 164, 84, 0.13
      )
      // Accent blue orb — centre roaming
      drawOrb(
        w * (0.50 + Math.sin(time * 0.9 + 1) * 0.18),
        h * (0.45 + Math.cos(time * 0.8 + 1) * 0.15),
        w * 0.38, 74, 126, 196, 0.10
      )
      // Subtle warm highlight — top-right
      drawOrb(
        w * (0.82 + Math.cos(time * 0.5) * 0.07),
        h * (0.18 + Math.sin(time * 0.6) * 0.08),
        w * 0.30, 184, 151, 106, 0.08
      )

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
