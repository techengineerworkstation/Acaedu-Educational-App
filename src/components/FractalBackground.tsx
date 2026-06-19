import { motion } from 'framer-motion'

const orbs = [
  { size: 400, x: '5%', y: '15%', color: 'rgba(91,140,192,0.2)', duration: 18, delay: 0 },
  { size: 350, x: '65%', y: '55%', color: 'rgba(201,169,110,0.18)', duration: 22, delay: 2 },
  { size: 300, x: '35%', y: '75%', color: 'rgba(107,159,204,0.15)', duration: 20, delay: 4 },
  { size: 250, x: '75%', y: '25%', color: 'rgba(212,184,122,0.12)', duration: 25, delay: 1 },
  { size: 200, x: '50%', y: '45%', color: 'rgba(91,140,192,0.1)', duration: 15, delay: 3 },
]

const particles = Array.from({ length: 50 }, (_, i) => ({
  size: 4 + (i % 4) * 2,
  x: `${(i * 2) % 100}%`,
  y: `${(i * 2.1) % 100}%`,
  duration: 12 + (i % 6) * 2,
  delay: i * 0.3,
  color: i % 3 === 0 ? 'rgba(91,140,192,0.4)' : i % 3 === 1 ? 'rgba(201,169,110,0.4)' : 'rgba(107,159,204,0.3)',
}))

export function FractalBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Large gradient orbs */}
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
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
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
            y: [0, -80, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* Rotating rings */}
      <motion.div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          left: '50%',
          top: '50%',
          marginLeft: -300,
          marginTop: -300,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.1)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          left: '50%',
          top: '50%',
          marginLeft: -200,
          marginTop: -200,
          borderRadius: '50%',
          border: '1px solid rgba(91,140,192,0.08)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
