import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { navbarVariants } from '../animations/variants'
import { NAV_LINKS, SOCIAL } from '../constants'
import { Button } from '../components/ui/Button'

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 3L2 10.5l6 2m13-9.5L16.5 20l-6.5-6m11-11L9.5 14" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
  </svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
  </svg>
)

function LogoMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-10 h-10 flex-shrink-0">
        <img
          src="/logo.png"
          alt="Trillion Traders 369 Logo"
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
      <div className="flex flex-col leading-none">
        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: 'white', fontSize: '0.875rem', letterSpacing: '-0.01em' }}>Trillion</span>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#DDA73C', fontSize: '0.875rem', letterSpacing: '-0.01em' }}>Traders 369</span>
      </div>
    </div>
  )
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-gold origin-left z-[60]" style={{ scaleX }} />
}

function NavItem({ href, label, currentPath }: { href: string; label: string; currentPath: string }) {
  const isActive = currentPath === href
  return (
    <Link to={href}>
      <motion.div
        whileHover={{ color: '#FFD700' }}
        className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg
          ${isActive ? 'text-gold' : 'text-white/60 hover:text-white'}`}
      >
        {label}
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 60))
    return () => unsub()
  }, [scrollY])

  useEffect(() => { setIsOpen(false) }, [location.pathname])

  const desktopLinks = NAV_LINKS.slice(0, 6)

  return (
    <>
      <ScrollProgressBar />
      <motion.header
        variants={navbarVariants}
        initial="top"
        animate={scrolled ? 'scrolled' : 'top'}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      >
        <div className="section-container">
          <nav className="flex items-center justify-between h-16 md:h-18">
            <Link to="/" className="flex-shrink-0">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                <LogoMark />
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {desktopLinks.map((link) => (
                <NavItem key={link.href} href={link.href} label={link.label} currentPath={location.pathname} />
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" size="sm" href={SOCIAL.TELEGRAM} target="_blank" rel="noopener noreferrer" leftIcon={<TelegramIcon />}>
                Join Channel
              </Button>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(221,167,60,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '8px 20px', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #F5D36B 0%, #DDA73C 45%, #996D19 100%)',
                    color: '#030303', fontWeight: 700, fontSize: '0.8125rem',
                    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 0 14px rgba(221,167,60,0.25)',
                  }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl glass text-white/80"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </motion.button>
          </nav>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden border-t border-white/5"
              style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(24px)' }}
            >
              <div className="section-container py-6 flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        location.pathname === link.href ? 'text-gold bg-gold/8' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                  <Button variant="outline" size="md" fullWidth href={SOCIAL.TELEGRAM} target="_blank" leftIcon={<TelegramIcon />}>
                    Join Telegram
                  </Button>
                  <Link to="/contact" className="w-full">
                    <Button variant="gold" size="md" fullWidth>Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
