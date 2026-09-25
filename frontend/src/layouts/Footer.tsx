import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../animations/variants'
import { APP_NAME, SOCIAL } from '../constants'

const socialLinks = [
  {
    label: 'Telegram',
    href: SOCIAL.TELEGRAM,
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 3L2 10.5l6 2m13-9.5L16.5 20l-6.5-6m11-11L9.5 14" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: SOCIAL.INSTAGRAM,
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
]

const footerLinks = [
  {
    heading: 'Platform',
    links: [
      { label: 'Trading Academy 🎓', href: '/courses' },
      { label: 'About Us', href: '/about' },
      { label: 'Trading Tools', href: '/tools' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Free Resources', href: '/resources' },
      { label: 'Prop Firms', href: '/prop-firms' },
      { label: 'Brokers', href: '/brokers' },
      { label: 'Testimonials', href: '/testimonials' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Risk Disclaimer', href: '/disclaimer' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/5 mt-20">
      {/* Gradient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="section-container pt-16 pb-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5"
        >
          {/* Brand Column */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Trillion Traders 369 Logo"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: 'white', fontSize: '1rem', lineHeight: 1 }}>Trillion</div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#DDA73C', fontSize: '1rem', lineHeight: 1 }}>Traders 369</div>
                </div>
              </div>
            </Link>

            <p className="text-white/45 text-sm leading-relaxed max-w-xs mb-6">
              A premier international trading academy providing world-class forex education, live market analysis, and vetted trading tools.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-gold transition-colors duration-200"
                  aria-label={s.label}
                >
                  <s.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <motion.div key={col.heading} variants={staggerItem}>
              <h5 className="font-heading font-semibold text-white/80 text-sm uppercase tracking-widest mb-4">
                {col.heading}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className="text-sm text-white/40 hover:text-gold transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-white/20 text-xs text-center">
            Trading involves significant risk of loss. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  )
}
