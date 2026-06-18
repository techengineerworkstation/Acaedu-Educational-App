import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function FractalBackground() {
  const [orbs] = useState(() => Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: 300 + Math.random() * 400,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: i % 2 === 0 ? 'rgba(91,140,192,0.08)' : 'rgba(201,169,110,0.06)',
    duration: 15 + Math.random() * 20,
  })))

  return (
    <div className="fractal-bg">
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          className="orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
