import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

function SpiralParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 8
      const radius = 2 + (i / count) * 6
      const yOffset = (i / count) * 10 - 5
      const r1 = seededRandom(i * 3)
      const r2 = seededRandom(i * 3 + 1)
      const r3 = seededRandom(i * 3 + 2)
      const r4 = seededRandom(i * 3 + 3)
      arr.push({
        angle,
        radius,
        yOffset,
        speed: 0.2 + r1 * 0.3,
        size: 0.02 + r2 * 0.04,
        color: new THREE.Color().setHSL(0.58 + r3 * 0.08, 0.45, 0.35 + r4 * 0.15),
      })
    }
    return arr
  }, [count])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    particles.forEach((p, i) => {
      const currentAngle = p.angle + time * p.speed
      const x = Math.cos(currentAngle) * p.radius
      const z = Math.sin(currentAngle) * p.radius
      const y = p.yOffset + Math.sin(time * 0.5 + i * 0.1) * 0.5

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(p.size * (1 + Math.sin(time + i) * 0.3))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#1B3A5C" transparent opacity={0.5} />
    </instancedMesh>
  )
}

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null!)

  const orbData = useMemo(() => [
    { pos: [4, 2, -3] as [number, number, number], size: 1.5, color: '#1B3A5C', speed: 0.3 },
    { pos: [-5, -1, -4] as [number, number, number], size: 2, color: '#B8976A', speed: 0.2 },
    { pos: [3, -3, -2] as [number, number, number], size: 1.2, color: '#2A5580', speed: 0.4 },
    { pos: [-4, 3, -5] as [number, number, number], size: 1.8, color: '#D4BA8A', speed: 0.25 },
    { pos: [6, 0, -6] as [number, number, number], size: 1, color: '#3A6B9F', speed: 0.35 },
    { pos: [-6, -2, -3] as [number, number, number], size: 1.3, color: '#1B3A5C', speed: 0.3 },
    { pos: [0, 4, -4] as [number, number, number], size: 1.6, color: '#B8976A', speed: 0.28 },
    { pos: [-3, -4, -5] as [number, number, number], size: 1.1, color: '#2A5580', speed: 0.32 },
  ], [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    orbsRef.current.children.forEach((orb, i) => {
      const data = orbData[i]
      orb.position.x = data.pos[0] + Math.sin(time * data.speed + i) * 2
      orb.position.y = data.pos[1] + Math.cos(time * data.speed * 0.7 + i) * 1.5
      orb.position.z = data.pos[2] + Math.sin(time * data.speed * 0.5 + i * 2) * 1
    })
  })

  return (
    <group ref={orbsRef}>
      {orbData.map((orb, i) => (
        <mesh key={i} position={orb.pos}>
          <sphereGeometry args={[orb.size, 32, 32]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  )
}

function SpiralRings() {
  const ringsRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    ringsRef.current.children.forEach((ring, i) => {
      ring.rotation.x = time * 0.1 * (i % 2 === 0 ? 1 : -1)
      ring.rotation.y = time * 0.15 * (i % 2 === 0 ? 1 : -1)
      ring.rotation.z = time * 0.05 * (i % 2 === 0 ? 1 : -1)
    })
  })

  return (
    <group ref={ringsRef}>
      {[5, 4, 3, 2].map((size, i) => (
        <mesh key={i} rotation={[Math.PI / 4 * i, Math.PI / 6 * i, 0]}>
          <torusGeometry args={[size, 0.01, 16, 100]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#1B3A5C' : '#B8976A'}
            transparent
            opacity={0.04 + i * 0.015}
          />
        </mesh>
      ))}
    </group>
  )
}

function FloatingLines() {
  const linesRef = useRef<THREE.Group>(null!)

  const lineData = useMemo(() => {
    const lines = []
    for (let i = 0; i < 12; i++) {
      const points = []
      const startAngle = (i / 12) * Math.PI * 2
      const radius = 3 + seededRandom(i * 7) * 4
      for (let j = 0; j <= 20; j++) {
        const t = j / 20
        const angle = startAngle + t * Math.PI * 2
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius * (1 - t * 0.3),
          t * 8 - 4,
          Math.sin(angle) * radius * (1 - t * 0.3)
        ))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: i % 3 === 0 ? '#1B3A5C' : i % 3 === 1 ? '#B8976A' : '#2A5580',
        transparent: true,
        opacity: 0.03,
      })
      lines.push({ geometry, material, speed: 0.1 + seededRandom(i * 11) * 0.2 })
    }
    return lines
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    linesRef.current.children.forEach((line, i) => {
      line.rotation.y = time * lineData[i].speed
    })
  })

  return (
    <group ref={linesRef}>
      {lineData.map((line, i) => (
        <primitive key={i} object={new THREE.Line(line.geometry, line.material)} />
      ))}
    </group>
  )
}

export function FractalBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <SpiralParticles count={300} />
        <FloatingOrbs />
        <SpiralRings />
        <FloatingLines />
      </Canvas>
    </div>
  )
}
