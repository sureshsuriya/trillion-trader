import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem, sectionHeaderVariants, scaleUp } from '../../animations/variants'
import { Card, StatCard } from '../ui/Card'
import { Button } from '../ui/Button'
import { SOCIAL } from '../../constants'
import { TradingViewWidget } from './TradingViewWidget'

// ============================================
// SERVICE CARDS
// ============================================
const services = [
  { icon: '📊', title: 'Live Market Analysis', description: 'Daily forex setups, entry zones, and real-time trade ideas shared directly in our Telegram community.', href: '/services' },
  { icon: '🎓', title: 'Trading Education', description: 'From beginner to advanced — master price action, ICT concepts, risk management, and trading psychology.', href: '/courses' },
  { icon: '🏦', title: 'Prop Firm Guidance', description: 'Curated reviews and strategies for FTMO, MFF, Funded Next, and more. Pass your challenge with confidence.', href: '/prop-firms' },
  { icon: '🔧', title: 'Professional Tools', description: '6 premium calculators — lot size, risk, pip value, margin, P&L, and position sizing. All free.', href: '/tools' },
  { icon: '🤝', title: 'Broker Reviews', description: 'Thoroughly vetted broker comparisons with exclusive referral partnerships and trusted recommendations.', href: '/brokers' },
  { icon: '💬', title: 'Community & Mentorship', description: 'A tight-knit community of serious traders. Ask questions, share insights, grow together.', href: '/contact' },
]

export function ServicesPreview() {
  return (
    <section className="section-padding relative">
      <div className="section-container">
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">What We Offer</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Trade Successfully</span>
          </h2>
          <p className="text-white/45 text-lg max-w-2xl mx-auto">
            From live signals to professional education, we provide all the tools and knowledge you need to succeed in the financial markets.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={staggerItem}>
              <Link to={service.href} className="block h-full">
                <Card className="p-6 h-full group" tilt glow>
                  <div className="text-3xl mb-4">{service.icon}</div>
                  <h3 className="font-heading font-semibold text-white text-lg mb-2 group-hover:text-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">{service.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-gold/60 text-xs font-medium group-hover:text-gold transition-colors duration-300">
                    Learn more
                    <svg viewBox="0 0 24 24" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round"/>
                    </svg>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// STATS SECTION
// ============================================
export function StatsSection() {
  const stats = [
    { label: 'Active Community Members', value: '2,500', suffix: '+', icon: '👥' },
    { label: 'Average Win Rate', value: '78', suffix: '%', icon: '🎯' },
    { label: 'Years of Experience', value: '7', suffix: '+', icon: '📅' },
    { label: 'Countries Reached', value: '25', suffix: '+', icon: '🌍' },
    { label: 'Free Resources Available', value: '50', suffix: '+', icon: '📚' },
    { label: 'Successful Traders Trained', value: '1,200', suffix: '+', icon: '🏆' },
  ]

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-glow-gold opacity-30 pointer-events-none" />
      <div className="section-container relative z-10">
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">By The Numbers</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Traders <span className="gradient-text">Worldwide</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem}>
              <StatCard label={stat.label} value={stat.value} suffix={stat.suffix} icon={<span className="text-lg">{stat.icon}</span>} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// TRADINGVIEW SECTION
// ============================================
export function TradingViewSection() {
  return (
    <section className="section-padding relative">
      <div className="section-container">
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge mb-4">Live Markets</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Real-Time Market <span className="gradient-text">Overview</span>
          </h2>
          <p className="text-white/45 text-lg max-w-2xl mx-auto">
            Professional-grade charts powered by TradingView. Track your instruments in real time.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass"
          style={{ borderRadius: '1.5rem', overflow: 'hidden' }}
        >
          <TradingViewWidget containerId="tv-widget-main" symbol="FX:EURUSD" height={500} />
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// CTA SECTION
// ============================================
export function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="section-container">
        <motion.div
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative glass rounded-4xl p-10 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-accent/4 pointer-events-none rounded-4xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <div className="relative z-10">
            <span className="badge mb-6">Join the Community</span>
            <h2 className="font-heading text-4xl md:text-6xl font-black text-white mb-6 text-balance">
              Ready to Start Your{' '}
              <span className="gradient-text">Trading Journey?</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10">
              Join over 2,500 traders in the Trillion Traders 369 community. Get daily market analysis, premium education, and professional tools — all for free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses">
                <Button variant="gold" size="xl">
                  Enroll in Academy 🎓
                </Button>
              </Link>
              <Button variant="outline" size="xl" href={SOCIAL.TELEGRAM} target="_blank" rel="noopener noreferrer">
                Join Telegram Channel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
