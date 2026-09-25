import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const FEATURED_COURSES = [
  {
    title: 'Forex & Price Action Foundations 101',
    slug: 'forex-price-action-foundations-101',
    category: 'FOREX',
    level: 'BEGINNER',
    duration: '3h 45m',
    accessType: 'FREE',
    rating: '4.9 ★',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    description: 'Master candlestick patterns, market structure, support/resistance, and risk management.',
  },
  {
    title: 'Prop Firm Challenge Mastery: Passing 10% Targets',
    slug: 'prop-firm-challenge-mastery',
    category: 'PROP FIRM',
    level: 'ADVANCED',
    duration: '5h 15m',
    accessType: 'PREMIUM',
    rating: '5.0 ★',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    description: 'A battle-tested blueprint to pass FTMO, Funding Pips, and top prop challenges without breaching daily drawdowns.',
  },
  {
    title: 'Smart Money Concepts (SMC) & Liquidity Pools',
    slug: 'smart-money-concepts-smc',
    category: 'SMC',
    level: 'INTERMEDIATE',
    duration: '6h 30m',
    accessType: 'PREMIUM',
    rating: '4.85 ★',
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    description: 'Trade like central banks and hedge funds by identifying Order Blocks, Fair Value Gaps (FVG), and Liquidity sweeps.',
  },
]

export function AcademyFeaturedSection() {
  return (
    <section className="py-20 relative bg-surface border-y border-white/5 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest mb-3">
              🎓 Online Trading Academy
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Featured <span className="gold-gradient-text">Trading Courses</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base mt-2 max-w-xl">
              Step-by-step video curriculums designed to take you from market beginner to funded prop trader.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link to="/courses">
              <Button variant="outline" size="md">
                Browse All Courses →
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_COURSES.map((course, idx) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-gold/10"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase bg-gold text-bg">
                      {course.accessType}
                    </span>
                    <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-bg/80 text-white border border-white/10">
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2 font-mono">
                    <span>⏱️ {course.duration}</span>
                    <span>•</span>
                    <span className="text-gold">{course.rating}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-200 mb-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gold font-semibold uppercase">{course.category}</span>
                <Link to={`/courses/${course.slug}`}>
                  <Button variant="gold" size="sm">
                    Start Course
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
