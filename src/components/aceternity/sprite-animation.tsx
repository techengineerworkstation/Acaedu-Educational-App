'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SpriteFrame {
  x: number; y: number; w: number; h: number
}

interface SpriteConfig {
  name: string
  frames: SpriteFrame[]
  fps: number
  loop: boolean
  color: string
  size: number
}

interface SpriteAnimationProps {
  className?: string
  sprites?: SpriteConfig[]
  maxParticles?: number
}

const defaultSprites: SpriteConfig[] = [
  // Orbiting academic ring
  {
    name: 'orbit',
    frames: Array.from({ length: 12 }, (_, i) => ({
      x: 0, y: 0, w: 6, h: 6, // size per frame
      // encode angle in frame index
    })),
    fps: 8,
    loop: true,
    color: 'rgba(77,208,216,0.3)',
    size: 5,
  },
  // Floating book sprite
  {
    name: 'book',
    frames: Array.from({ length: 8 }, (_, i) => ({
      x: 0, y: 0, w: 10, h: 14,
    })),
    fps: 6,
    loop: true,
    color: 'rgba(193,39,45,0.25)',
    size: 10,
  },
  // Graduation cap sprite
  {
    name: 'cap',
    frames: Array.from({ length: 6 }, (_, i) => ({
      x: 0, y: 0, w: 12, h: 10,
    })),
    fps: 4,
    loop: true,
    color: 'rgba(240,204,90,0.2)',
    size: 12,
  },
]

function drawOrbit(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string, size: number) {
  const r = size * 4
  const px = x + Math.cos(angle) * r
  const py = y + Math.sin(angle) * r

  // trail
  for (let i = 1; i <= 6; i++) {
    const ta = angle - i * 0.15
    const tx = x + Math.cos(ta) * r
    const ty = y + Math.sin(ta) * r
    ctx.beginPath()
    ctx.arc(tx, ty, size * 0.5 * (1 - i / 7), 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.15 * (1 - i / 7)
    ctx.fill()
  }

  // core
  ctx.beginPath()
  ctx.arc(px, py, size, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.globalAlpha = 0.7
  ctx.fill()

  // glow
  const g = ctx.createRadialGradient(px, py, 0, px, py, size * 5)
  g.addColorStop(0, color)
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.globalAlpha = 0.12
  ctx.fillRect(px - size * 5, py - size * 5, size * 10, size * 10)
  ctx.globalAlpha = 1
}

function drawBook(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, color: string, size: number) {
  const wobble = Math.sin(frame * 0.3) * 3
  const bx = x
  const by = y + wobble
  const bw = size * 1.2
  const bh = size * 1.6

  ctx.save()
  ctx.translate(bx, by)
  ctx.rotate(Math.sin(frame * 0.1) * 0.1)

  // book body
  ctx.fillStyle = color
  ctx.globalAlpha = 0.6
  ctx.fillRect(-bw / 2, -bh / 2, bw, bh)

  // pages
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillRect(-bw / 2 + 2, -bh / 2 + 2, bw - 4, bh - 4)

  // spine
  ctx.beginPath()
  ctx.moveTo(0, -bh / 2)
  ctx.lineTo(0, bh / 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1
  ctx.stroke()

  // spine glow
  const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3)
  sg.addColorStop(0, color)
  sg.addColorStop(1, 'transparent')
  ctx.fillStyle = sg
  ctx.globalAlpha = 0.08
  ctx.fillRect(-size * 3, -size * 3, size * 6, size * 6)

  ctx.restore()
  ctx.globalAlpha = 1
}

function drawCap(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, color: string, size: number) {
  const bob = Math.sin(frame * 0.2) * 2
  const cx = x
  const cy = y + bob

  ctx.save()
  ctx.translate(cx, cy)

  // cap top (diamond)
  ctx.beginPath()
  ctx.moveTo(0, -size * 0.5)
  ctx.lineTo(size * 0.8, 0)
  ctx.lineTo(0, size * 0.2)
  ctx.lineTo(-size * 0.8, 0)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.globalAlpha = 0.6
  ctx.fill()

  // tassel
  const tasselAngle = frame * 0.08
  const tx = size * 0.3 + Math.cos(tasselAngle) * size * 0.3
  const ty = size * 0.1 + Math.sin(tasselAngle) * size * 0.15
  ctx.beginPath()
  ctx.moveTo(0, -size * 0.3)
  ctx.quadraticCurveTo(tx * 0.5, ty, tx, ty + size * 0.4)
  ctx.strokeStyle = 'rgba(240,204,90,0.4)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // tassel end
  ctx.beginPath()
  ctx.arc(tx, ty + size * 0.4, 2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(240,204,90,0.5)'
  ctx.fill()

  // glow
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3)
  g.addColorStop(0, color)
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.globalAlpha = 0.06
  ctx.fillRect(-size * 3, -size * 3, size * 6, size * 6)

  ctx.restore()
  ctx.globalAlpha = 1
}

interface Particle {
  spriteIdx: number
  x: number; y: number
  vx: number; vy: number
  angle: number
  frame: number
  orbitRadius: number
  orbitSpeed: number
}

export function SpriteAnimation({
  className,
  sprites = defaultSprites,
  maxParticles = 18,
}: SpriteAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animId: number
    let t = 0

    const particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    // init particles
    const init = () => {
      particles.length = 0
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      for (let i = 0; i < maxParticles; i++) {
        const spriteIdx = i % sprites.length
        particles.push({
          spriteIdx,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2 - 0.1,
          angle: Math.random() * Math.PI * 2,
          frame: Math.floor(Math.random() * 60),
          orbitRadius: 15 + Math.random() * 30,
          orbitSpeed: 0.5 + Math.random() * 1.2,
        })
      }
    }

    const animate = () => {
      t += 0.016
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = 'rgba(255,255,255,0.04)'
            ctx.lineWidth = 0.5
            ctx.globalAlpha = 1 - dist / 120
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      particles.forEach(p => {
        const sprite = sprites[p.spriteIdx]
        p.frame++
        p.angle += p.orbitSpeed * 0.02

        // drift
        p.x += p.vx + Math.sin(t * 0.5 + p.frame * 0.01) * 0.15
        p.y += p.vy + Math.cos(t * 0.3 + p.frame * 0.01) * 0.1

        // wrap
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        switch (sprite.name) {
          case 'orbit':
            drawOrbit(ctx, p.x, p.y, p.angle, sprite.color, sprite.size)
            break
          case 'book':
            drawBook(ctx, p.x, p.y, p.frame, sprite.color, sprite.size)
            break
          case 'cap':
            drawCap(ctx, p.x, p.y, p.frame, sprite.color, sprite.size)
            break
        }
      })

      animId = requestAnimationFrame(animate)
    }

    resize()
    init()
    animate()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [sprites, maxParticles])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
    />
  )
}
