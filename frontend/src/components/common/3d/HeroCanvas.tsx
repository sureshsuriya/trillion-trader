import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ============================================
// FLOATING CANDLESTICK
// ============================================
interface CandlestickProps {
  position: [number, number, number]
  height: number
  isGreen: boolean
  delay?: number
}

function Candlestick({ position, height, isGreen, delay = 0 }: CandlestickProps) {
  const bodyRef = useRef<THREE.Mesh>(null)
  const wickRef = useRef<THREE.Mesh>(null)
  const color = isGreen ? '#00E676' : '#FF4D4F'
  const emissiveIntensity = 0.5

  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.1
    }
    if (wickRef.current) {
      wickRef.current.position.y = position[1] + height / 2 + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.1
    }
  })

  return (
    <group>
      {/* Body */}
      <mesh ref={bodyRef} position={position}>
        <boxGeometry args={[0.12, height, 0.12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Wick */}
      <mesh ref={wickRef} position={[position[0], position[1] + height / 2, position[2]]}>
        <boxGeometry args={[0.02, height * 0.5, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

// ============================================
// FLOATING PARTICLES
// ============================================
function FloatingParticles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      )
      const scale = Math.random() * 0.04 + 0.01
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.matrix)
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)
      dummy.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.3) * 0.002
      dummy.rotation.x = state.clock.elapsedTime * 0.3 + i
      dummy.rotation.y = state.clock.elapsedTime * 0.2 + i
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

// ============================================
// GOLD ORB / GLOBE
// ============================================
function GoldOrb() {
  const orbRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.2
      orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
    }
  })

  return (
    <Float floatIntensity={0.5} speed={2}>
      <Sphere ref={orbRef} args={[1.2, 64, 64]} position={[2.5, 0, -1]}>
        <MeshDistortMaterial
          color="#FFD700"
          emissive="#CC8800"
          emissiveIntensity={0.15}
          roughness={0.1}
          metalness={0.9}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.75}
        />
      </Sphere>
    </Float>
  )
}

// ============================================
// MOUSE PARALLAX CAMERA RIG
// ============================================
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.5
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.3
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame(() => {
    camera.position.x += (mouse.current.x - camera.position.x) * 0.03
    camera.position.y += (mouse.current.y - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ============================================
// HERO SCENE (THE FULL 3D EXPERIENCE)
// ============================================
function HeroScene() {
  const candles = [
    { position: [-3.5, -0.5, 0] as [number, number, number], height: 0.7, isGreen: true, delay: 0 },
    { position: [-2.8, 0.2, 0] as [number, number, number], height: 1.1, isGreen: false, delay: 0.5 },
    { position: [-2.1, -0.1, 0] as [number, number, number], height: 0.8, isGreen: true, delay: 1 },
    { position: [-1.4, 0.4, 0] as [number, number, number], height: 1.3, isGreen: true, delay: 1.5 },
    { position: [-0.7, 0.1, 0] as [number, number, number], height: 0.6, isGreen: false, delay: 2 },
    { position: [0, 0.6, 0] as [number, number, number], height: 1.5, isGreen: true, delay: 2.5 },
  ]

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#FFD700" />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#FFD700" distance={8} />
      <pointLight position={[3, -2, 2]} intensity={0.4} color="#00E676" distance={6} />

      <Stars radius={60} depth={40} count={800} factor={2} saturation={0} fade speed={0.5} />

      <CameraRig />

      {/* Candlesticks */}
      {candles.map((c, i) => (
        <Candlestick key={i} {...c} />
      ))}

      {/* Gold orb */}
      <GoldOrb />

      {/* Floating gold particles */}
      <FloatingParticles count={60} />

      {/* Environment for reflections */}
      <Environment preset="night" />
    </>
  )
}

// ============================================
// EXPORTED HERO CANVAS COMPONENT
// ============================================
export function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <HeroScene />
      </Canvas>
    </div>
  )
}

// ============================================
// LIGHTWEIGHT BACKGROUND CANVAS (Other pages)
// ============================================
function BackgroundScene() {
  return (
    <>
      <Stars radius={80} depth={50} count={400} factor={1.5} saturation={0} fade speed={0.3} />
      <FloatingParticles count={30} />
      <ambientLight intensity={0.1} />
    </>
  )
}

export function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1]}
        performance={{ min: 0.5 }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  )
}
