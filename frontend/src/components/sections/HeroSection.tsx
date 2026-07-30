import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { heroTextVariants, staggerContainer, staggerItem, fadeUp } from '../../animations/variants'
import { Button } from '../ui/Button'
import { HERO_STATS, SOCIAL } from '../../constants'

// Lazy-load the heavy 3D canvas
const HeroCanvas = lazy(() =>
  import('../common/3d/HeroCanvas').then((m) => ({ default: m.HeroCanvas }))
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 3L2 10.5l6 2m13-9.5L16.5 20l-6.5-6m11-11L9.5 14" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-hero-gradient" />}>
        <HeroCanvas />
      </Suspense>

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* HERO CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center section-container pt-28 pb-16 text-center">

        {/* Badge */}
        <motion.div variants={heroTextVariants} initial="hidden" animate="visible" custom={0} className="mb-6">
          <span className="badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00E676', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            Premium Trading Academy — Est. 2018
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          custom={0.15}
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '900px' }}
        >
          Trade Smarter.{' '}
          <span className="gradient-text">Grow Richer.</span>
          <br />
          <span style={{ color: 'rgba(255,255,255,0.9)' }}>Trade with</span>{' '}
          <span className="gradient-text">Precision.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          custom={0.3}
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.125rem', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: 1.7 }}
        >
          Join <span style={{ color: '#DDA73C', fontWeight: 600 }}>2,500+ traders</span> mastering the financial markets
          with professional forex education, live analysis, and world-class trading tools.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          custom={0.45}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}
        >
          <Link to="/services">
            <Button variant="gold" size="xl" rightIcon={<ArrowRightIcon />}>
              Start Learning
            </Button>
          </Link>
          <Button variant="ghost" size="xl" href={SOCIAL.TELEGRAM} target="_blank" rel="noopener noreferrer" leftIcon={<TelegramIcon />}>
            Telegram
          </Button>
          <Button variant="ghost" size="xl" href={SOCIAL.INSTAGRAM} target="_blank" rel="noopener noreferrer" leftIcon={<InstagramIcon />}>
            Instagram
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '720px' }}
          className="sm:grid-cols-4"
        >
          {HERO_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="glass"
              style={{ padding: '1rem', textAlign: 'center', borderRadius: '1rem' }}
            >
              <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '1.75rem', fontWeight: 700, color: '#DDA73C', marginBottom: '4px' }}>
                {stat.value}{(stat as any).suffix ?? ''}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Trust indicators */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.7}
        className="relative z-10 section-container"
        style={{ paddingBottom: '2rem' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
          {['🔒 Secure & Trusted', '🌍 25+ Countries', '📊 Live Market Analysis', '🏆 7+ Years Experience'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Scroll</span>
          <div style={{ width: '1px', height: '2rem', background: 'linear-gradient(to bottom, rgba(221,167,60,0.4), transparent)' }} />
        </motion.div>
      </div>
    </section>
  )
}
