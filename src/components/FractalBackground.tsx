import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 80

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, _i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.06,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 2,
        p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 1.5,
        p.position[2]
      )
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * 2 + p.offset) * 0.3))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#5B8CC0" transparent opacity={0.3} />
    </instancedMesh>
  )
}

function FloatingOrbs() {
  const orbs = useMemo(() => [
    { pos: [-4, 2, -5] as [number, number, number], color: '#5B8CC0', scale: 1.5, speed: 0.3 },
    { pos: [5, -1, -8] as [number, number, number], color: '#C9A96E', scale: 1.2, speed: 0.4 },
    { pos: [-2, -3, -6] as [number, number, number], color: '#6B9FCC', scale: 0.8, speed: 0.5 },
    { pos: [3, 3, -10] as [number, number, number], color: '#D4B87A', scale: 1.0, speed: 0.35 },
  ], [])

  return (
    <>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} />
      ))}
    </>
  )
}

function FloatingOrb({ pos, color, scale, speed }: {
  pos: [number, number, number]; color: string; scale: number; speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.position.x = pos[0] + Math.sin(t * speed) * 1.5
    meshRef.current.position.y = pos[1] + Math.cos(t * speed * 0.8) * 1
    meshRef.current.scale.setScalar(scale + Math.sin(t * 1.5) * 0.1)
  })

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        roughness={0.8}
      />
    </mesh>
  )
}

function RotatingRing() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    ringRef.current.rotation.z = clock.getElapsedTime() * 0.1
    ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.2
  })

  return (
    <mesh ref={ringRef} position={[0, 0, -15]}>
      <torusGeometry args={[8, 0.05, 16, 100]} />
      <meshStandardMaterial color="#C9A96E" transparent opacity={0.08} />
    </mesh>
  )
}

export function FractalBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <FloatingParticles />
        <FloatingOrbs />
        <RotatingRing />
      </Canvas>
    </div>
  )
}
