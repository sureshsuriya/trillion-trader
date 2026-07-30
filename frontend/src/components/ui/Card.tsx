import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  tilt?: boolean
  glow?: boolean
  onClick?: () => void
}

export function Card({
  children,
  className = '',
  tilt = false,
  glow = true,
  onClick,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Tilt mouse tracking
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-5deg', '5deg'])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / (rect.width / 2))
    y.set((e.clientY - centerY) / (rect.height / 2))
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={
        glow
          ? { boxShadow: `0 0 28px rgba(255,184,0,0.18), 0 12px 48px rgba(0,0,0,0.7)`, borderColor: 'rgba(255,184,0,0.25)' }
          : undefined
      }
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        glass transition-all duration-400
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// STAT CARD
// ============================================
interface StatCardProps {
  label: string
  value: string
  suffix?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, suffix, icon, className = '' }: StatCardProps) {
  return (
    <Card className={`p-6 text-center ${className}`} glow>
      {icon && (
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
            {icon}
          </div>
        </div>
      )}
      <div className="font-mono text-3xl font-bold text-gold mb-1">
        {value}
        {suffix && <span className="text-xl">{suffix}</span>}
      </div>
      <div className="text-sm text-white/50 font-medium">{label}</div>
    </Card>
  )
}
