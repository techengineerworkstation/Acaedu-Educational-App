import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 1.0) * 43758.5453
  return x - Math.floor(x)
}

/* ── 1. Constellation — stars + connecting lines ─────────────── */
function ConstellationGrid({ count = 100 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  const { points, lines } = useMemo(() => {
    const verts: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      verts.push(new THREE.Vector3(
        (seededRandom(i * 3)     - 0.5) * 22,
        (seededRandom(i * 3 + 1) - 0.5) * 14,
        (seededRandom(i * 3 + 2) - 0.5) * 6 - 4,
      ))
    }

    const ptGeo = new THREE.BufferGeometry().setFromPoints(verts)
    const ptMat = new THREE.PointsMaterial({ color: '#025e6b', size: 0.07, transparent: true, opacity: 0.50, sizeAttenuation: true })
    const points = new THREE.Points(ptGeo, ptMat)

    const lineVerts: THREE.Vector3[] = []
    const thresh = 4.8
    for (let a = 0; a < count; a++) {
      for (let b = a + 1; b < count; b++) {
        if (verts[a].distanceTo(verts[b]) < thresh) {
          lineVerts.push(verts[a].clone(), verts[b].clone())
        }
      }
    }
    const lnGeo = new THREE.BufferGeometry().setFromPoints(lineVerts)
    const lnMat = new THREE.LineBasicMaterial({ color: '#4dd0d8', transparent: true, opacity: 0.06 })
    const lines = new THREE.LineSegments(lnGeo, lnMat)

    return { points, lines }
  }, [count])

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.add(points, lines)
    return () => { groupRef.current?.remove(points, lines) }
  }, [points, lines])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.055
  })

  return <group ref={groupRef} />
}

/* ── 2. DNA Double Helix ─────────────────────────────────────── */
function DNAHelix({ strands = 72 }: { strands?: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  const meshARef = useRef<THREE.InstancedMesh>(null!)
  const meshBRef = useRef<THREE.InstancedMesh>(null!)
  const connRef  = useRef<THREE.InstancedMesh>(null!)
  const dummy    = useMemo(() => new THREE.Object3D(), [])
  const connCount = Math.ceil(strands / 4)

  useFrame(({ clock }) => {
    if (!meshARef.current || !meshBRef.current || !connRef.current) return
    const t = clock.elapsedTime
    if (groupRef.current) groupRef.current.rotation.y = t * 0.07
    const radius = 0.85
    const spread = 9

    for (let i = 0; i < strands; i++) {
      const angle = (i / strands) * Math.PI * 6 + t * 0.22
      const y = (i / strands) * spread - spread / 2

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius - 5)
      dummy.scale.setScalar(0.065); dummy.updateMatrix()
      meshARef.current.setMatrixAt(i, dummy.matrix)

      dummy.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius - 5)
      dummy.scale.setScalar(0.065); dummy.updateMatrix()
      meshBRef.current.setMatrixAt(i, dummy.matrix)

      if (i % 4 === 0) {
        const ix = Math.floor(i / 4)
        if (ix < connCount) {
          const ax = Math.cos(angle) * radius, az = Math.sin(angle) * radius - 5
          const bx = Math.cos(angle + Math.PI) * radius, bz = Math.sin(angle + Math.PI) * radius - 5
          dummy.position.set((ax + bx) / 2, y, (az + bz) / 2)
          dummy.scale.set(radius * 1.9, 0.014, 0.014)
          dummy.rotation.y = angle + Math.PI / 2
          dummy.updateMatrix()
          connRef.current.setMatrixAt(ix, dummy.matrix)
        }
      }
    }
    meshARef.current.instanceMatrix.needsUpdate = true
    meshBRef.current.instanceMatrix.needsUpdate = true
    connRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshARef} args={[undefined, undefined, strands]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#025e6b" transparent opacity={0.38} />
      </instancedMesh>
      <instancedMesh ref={meshBRef} args={[undefined, undefined, strands]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#c1272d" transparent opacity={0.38} />
      </instancedMesh>
      <instancedMesh ref={connRef} args={[undefined, undefined, connCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#e8535a" transparent opacity={0.15} />
      </instancedMesh>
    </group>
  )
}

/* ── 3. Morphing Icosahedron ─────────────────────────────────── */
function MorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const wireRef = useRef<THREE.Mesh>(null!)

  const solidGeo = useMemo(() => new THREE.IcosahedronGeometry(2.2, 3), [])
  const wireGeo  = useMemo(() => new THREE.IcosahedronGeometry(2.2, 3), [])
  const origPos  = useMemo(() => Float32Array.from(solidGeo.attributes.position.array as Float32Array), [solidGeo])

  useFrame(({ clock }) => {
    if (!meshRef.current || !wireRef.current) return
    const t = clock.elapsedTime * 0.38
    const pos = solidGeo.attributes.position.array as Float32Array
    for (let i = 0; i < pos.length; i += 3) {
      const x0 = origPos[i], y0 = origPos[i+1], z0 = origPos[i+2]
      const len = Math.sqrt(x0*x0 + y0*y0 + z0*z0) || 1
      const n = Math.sin(x0 * 1.4 + t) * Math.cos(y0 * 1.4 + t * 0.65) * 0.2
      pos[i]   = x0 + (x0/len)*n
      pos[i+1] = y0 + (y0/len)*n
      pos[i+2] = z0 + (z0/len)*n
    }
    solidGeo.attributes.position.needsUpdate = true
    solidGeo.computeVertexNormals()

    meshRef.current.rotation.x = t * 0.06
    meshRef.current.rotation.y = t * 0.10
    wireRef.current.rotation.x = t * 0.06
    wireRef.current.rotation.y = t * 0.10
  })

  return (
    <group position={[7, 1.5, -8]}>
      <mesh ref={meshRef} geometry={solidGeo}>
        <meshBasicMaterial color="#00262b" transparent opacity={0.04} />
      </mesh>
      <mesh ref={wireRef} geometry={wireGeo}>
        <meshBasicMaterial color="#4dd0d8" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

/* ── 4. Academic Torus Stack ─────────────────────────────────── */
function AcademicGeometry() {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    groupRef.current.children.forEach((c, i) => {
      c.rotation.x = t * (0.055 + i * 0.012) * (i % 2 === 0 ? 1 : -1)
      c.rotation.y = t * (0.085 + i * 0.009) * (i % 2 === 0 ? 1 : -1)
    })
  })
  return (
    <group ref={groupRef} position={[-7, -1.5, -8]}>
      {[4.4, 3.1, 2.0, 1.1].map((r, i) => (
        <mesh key={i} rotation={[Math.PI * i * 0.25, Math.PI * i * 0.15, 0]}>
          <torusGeometry args={[r, 0.013, 16, 120]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#b8860b' : '#025e6b'} transparent opacity={0.05 + i * 0.01} />
        </mesh>
      ))}
      <mesh>
        <octahedronGeometry args={[0.65, 0]} />
        <meshBasicMaterial color="#c1272d" wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  )
}

/* ── 5. Floating Particles ───────────────────────────────────── */
function FloatingParticles({ count = 180 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy   = useMemo(() => new THREE.Object3D(), [])
  const data    = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x:  (seededRandom(i*5)     - 0.5) * 22,
    y:  (seededRandom(i*5+1)   - 0.5) * 16,
    z:  (seededRandom(i*5+2)   - 0.5) * 8 - 2,
    sp: 0.16 + seededRandom(i*5+3) * 0.28,
    ph: seededRandom(i*5+4) * Math.PI * 2,
    sz: 0.024 + seededRandom(i*5+5) * 0.038,
  })), [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    data.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.sp + p.ph) * 0.55,
        p.y + Math.cos(t * p.sp * 0.7 + p.ph) * 0.45,
        p.z,
      )
      dummy.scale.setScalar(p.sz * (0.8 + Math.sin(t * p.sp + p.ph) * 0.2))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#4dd0d8" transparent opacity={0.24} />
    </instancedMesh>
  )
}

/* ── Export ──────────────────────────────────────────────────── */
export function FractalBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 58 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0) }}
      >
        <ConstellationGrid count={100} />
        <DNAHelix strands={72} />
        <MorphingSphere />
        <AcademicGeometry />
        <FloatingParticles count={180} />
      </Canvas>
    </div>
  )
}
