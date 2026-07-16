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

    const animate = () => {
      time += 0.005
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      const gradient1 = ctx.createRadialGradient(
        w * 0.3 + Math.sin(time) * 50, h * 0.3 + Math.cos(time * 0.7) * 50, 0,
        w * 0.3 + Math.sin(time) * 50, h * 0.3 + Math.cos(time * 0.7) * 50, w * 0.5
      )
      gradient1.addColorStop(0, 'rgba(27, 58, 92, 0.15)')
      gradient1.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, w, h)

      const gradient2 = ctx.createRadialGradient(
        w * 0.7 + Math.cos(time * 0.8) * 40, h * 0.6 + Math.sin(time * 0.6) * 40, 0,
        w * 0.7 + Math.cos(time * 0.8) * 40, h * 0.6 + Math.sin(time * 0.6) * 40, w * 0.4
      )
      gradient2.addColorStop(0, 'rgba(184, 151, 106, 0.12)')
      gradient2.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
