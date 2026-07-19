'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface FractalProps {
  className?: string
  depth?: number
  branchAngle?: number
  shrink?: number
  windSpeed?: number
  colors?: { trunk: string; leaf: string; glow: string }
}

export function FractalTree({
  className,
  depth = 9,
  branchAngle = 25,
  shrink = 0.72,
  windSpeed = 0.3,
  colors = { trunk: 'rgba(255,255,255,0.12)', leaf: 'rgba(77,208,216,0.35)', glow: 'rgba(193,39,45,0.15)' },
}: FractalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const drawBranch = (
      x: number, y: number, angle: number, length: number, d: number, wind: number
    ) => {
      if (d <= 0 || length < 1.5) return

      const sway = Math.sin(t * windSpeed + d * 0.5 + wind) * (depth - d) * 0.4
      const rad = ((angle + sway) * Math.PI) / 180
      const ex = x + Math.cos(rad) * length
      const ey = y + Math.sin(rad) * length

      const alpha = 0.1 + (d / depth) * 0.2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(ex, ey)
      ctx.strokeStyle = colors.trunk
      ctx.globalAlpha = alpha
      ctx.lineWidth = Math.max(0.4, d * 0.6)
      ctx.lineCap = 'round'
      ctx.stroke()

      // leaf glow at tips
      if (d <= 2) {
        const leafPulse = 0.3 + 0.3 * Math.sin(t * 1.5 + x * 0.01)
        ctx.beginPath()
        ctx.arc(ex, ey, 2 + leafPulse * 3, 0, Math.PI * 2)
        ctx.fillStyle = colors.leaf
        ctx.globalAlpha = leafPulse * 0.6
        ctx.fill()

        // outer glow
        const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8)
        glow.addColorStop(0, colors.glow)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.globalAlpha = leafPulse * 0.25
        ctx.fillRect(ex - 10, ey - 10, 20, 20)
      }

      ctx.globalAlpha = 1
      drawBranch(ex, ey, angle - branchAngle, length * shrink, d - 1, wind + 1)
      drawBranch(ex, ey, angle + branchAngle, length * shrink, d - 1, wind + 2)
      // extra sub-branch for fullness
      if (d > 3) {
        drawBranch(ex, ey, angle, length * shrink * 0.8, d - 2, wind + 3)
      }
    }

    const animate = () => {
      t += 0.016
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // root position: bottom-center
      const rootX = w * 0.5
      const rootY = h * 0.95
      const trunkLen = h * 0.22

      // main trunk split
      drawBranch(rootX, rootY, -90, trunkLen, depth, 0)
      // secondary smaller trees
      drawBranch(rootX - w * 0.25, rootY, -85, trunkLen * 0.6, depth - 2, 5)
      drawBranch(rootX + w * 0.28, rootY, -95, trunkLen * 0.5, depth - 3, 10)

      animId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [depth, branchAngle, shrink, windSpeed, colors])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
    />
  )
}
