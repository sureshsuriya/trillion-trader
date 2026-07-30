import type { Variants } from 'framer-motion'

// ============================================
// PAGE TRANSITIONS
// ============================================
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: 'easeIn' } },
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ============================================
// STAGGER CONTAINER
// ============================================
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

// ============================================
// CARD ANIMATIONS
// ============================================
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.01,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

export const glowHover = {
  rest: { boxShadow: '0 0 0px rgba(255,215,0,0)' },
  hover: {
    boxShadow: '0 0 30px rgba(255,215,0,0.2), 0 12px 48px rgba(0,0,0,0.5)',
    transition: { duration: 0.3 },
  },
}

// ============================================
// BUTTON ANIMATIONS
// ============================================
export const buttonTap = {
  tap: { scale: 0.97 },
}

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
}

// ============================================
// FLOATING ANIMATIONS
// ============================================
export const floating = {
  initial: { y: 0 },
  animate: {
    y: [-10, 0, -10],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const floatingSlow = {
  initial: { y: 0 },
  animate: {
    y: [-16, 0, -16],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
  },
}

// ============================================
// COUNTER ANIMATION
// ============================================
export const counterVariant: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'backOut' },
  },
}

// ============================================
// SECTION HEADER
// ============================================
export const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

// ============================================
// HERO TEXT SEQUENCE
// ============================================
export const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
export const navbarVariants: Variants = {
  top: { backgroundColor: 'rgba(5,5,5,0)', backdropFilter: 'blur(0px)', borderBottom: '1px solid transparent' },
  scrolled: {
    backgroundColor: 'rgba(5,5,5,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,215,0,0.1)',
    transition: { duration: 0.4 },
  },
}
