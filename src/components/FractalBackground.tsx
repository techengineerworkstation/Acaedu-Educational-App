import { motion } from 'framer-motion'

const orbs = [
  { size: 300, x: '10%', y: '20%', color: 'rgba(91,140,192,0.15)', duration: 20, delay: 0 },
  { size: 250, x: '70%', y: '60%', color: 'rgba(201,169,110,0.12)', duration: 25, delay: 2 },
  { size: 200, x: '40%', y: '80%', color: 'rgba(107,159,204,0.10)', duration: 22, delay: 4 },
  { size: 180, x: '80%', y: '30%', color: 'rgba(212,184,122,0.08)', duration: 28, delay: 1 },
]

const particles = Array.from({ length: 30 }, (_, i) => ({
  size: 3 + (i % 3) * 2,
  x: `${(i * 3.3) % 100}%`,
  y: `${(i * 7.7) % 100}%`,
  duration: 15 + (i % 5) * 3,
  delay: i * 0.5,
  color: i % 2 === 0 ? 'rgba(91,140,192,0.3)' : 'rgba(201,169,110,0.3)',
}))

export function FractalBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Gradient orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            borderRadius: '50%',
            background: p.color,
          }}
          animate={{
            y: [0, -60, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* Rotating ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          left: '50%',
          top: '50%',
          marginLeft: -250,
          marginTop: -250,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.08)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
