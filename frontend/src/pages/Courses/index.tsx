import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { coursesApi, type Course } from '../../api/coursesApi'
import { Button } from '../../components/ui/Button'
import { SEO } from '../../components/ui/SEO'

const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    title: 'Forex & Price Action Foundations 101',
    slug: 'forex-price-action-foundations-101',
    shortDescription: 'Master candlestick patterns, market structure, support/resistance, and risk management fundamentals.',
    description: 'The ultimate beginner course for traders entering the Forex and Stock markets.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    level: 'BEGINNER',
    category: 'FOREX',
    accessType: 'FREE',
    duration: '3h 45m',
    rating: 4.9,
    totalStudents: 1240,
    published: true,
    instructorName: 'Alexander Reed',
    instructorTitle: 'Senior Market Strategist & Prop Trader',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    modules: [],
  },
  {
    id: '2',
    title: 'Prop Firm Challenge Mastery: Passing 10% Targets',
    slug: 'prop-firm-challenge-mastery',
    shortDescription: 'A battle-tested blueprint to pass FTMO, Funding Pips, and top prop challenges without breaching daily drawdowns.',
    description: 'Learn drawdown management, risk sizing, and high-win-rate setups tailored for evaluation phases.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    level: 'ADVANCED',
    category: 'PROP_FIRM',
    accessType: 'PREMIUM',
    duration: '5h 15m',
    rating: 5.0,
    totalStudents: 890,
    published: true,
    instructorName: 'Marcus Vance',
    instructorTitle: 'Head Prop Portfolio Manager',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    modules: [],
  },
  {
    id: '3',
    title: 'Smart Money Concepts (SMC) & Liquidity Pools',
    slug: 'smart-money-concepts-smc',
    shortDescription: 'Trade like central banks and hedge funds by identifying Order Blocks, Fair Value Gaps (FVG), and Liquidity sweeps.',
    description: 'Uncover how institutional liquidity drives currency markets.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    level: 'INTERMEDIATE',
    category: 'TECHNICAL_ANALYSIS',
    accessType: 'PREMIUM',
    duration: '6h 30m',
    rating: 4.85,
    totalStudents: 1560,
    published: true,
    instructorName: 'Elena Rostova',
    instructorTitle: 'Quantitative Market Analyst',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    modules: [],
  },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    coursesApi
      .getAllCourses()
      .then((data) => {
        if (data && data.length > 0) setCourses(data)
      })
      .catch(() => {
        // Fallback to sample courses if backend is restarting
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'ALL' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'ALL' || course.level === selectedLevel
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <>
      <SEO
        title="Online Trading Academy & Courses | Trillion Traders"
        description="Master Forex trading, Smart Money Concepts, Price Action, and Prop Firm challenges with structured video courses."
      />

      <div className="py-12 md:py-20 relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest mb-4"
            >
              🎓 Institutional Trading Academy
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
            >
              Master The Markets With <span className="gold-gradient-text">Structured Courses</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-base md:text-lg leading-relaxed"
            >
              From raw candlestick price action to funded prop firm challenge blueprints. Learn proven strategies developed by funded traders.
            </motion.p>
          </div>

          {/* Filter & Search Bar */}
          <div className="glass rounded-2xl p-4 md:p-6 mb-12 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search courses or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors"
                />
                <svg
                  className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {['ALL', 'FOREX', 'PROP_FIRM', 'TECHNICAL_ANALYSIS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-gold text-bg shadow-lg shadow-gold/20'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL'
                      ? 'All Categories'
                      : cat === 'FOREX'
                      ? 'Forex'
                      : cat === 'PROP_FIRM'
                      ? 'Prop Firms'
                      : 'Technical Analysis'}
                  </button>
                ))}
              </div>

              {/* Level Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-white/40 font-mono">LEVEL:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold/60"
                >
                  <option value="ALL" className="bg-bg">All Levels</option>
                  <option value="BEGINNER" className="bg-bg">Beginner</option>
                  <option value="INTERMEDIATE" className="bg-bg">Intermediate</option>
                  <option value="ADVANCED" className="bg-bg">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/40 text-sm font-mono">Loading Trading Courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl border border-white/5">
              <p className="text-white/60 text-lg mb-2">No courses found matching your query.</p>
              <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory('ALL'); setSelectedLevel('ALL'); setSearchQuery(''); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative glass rounded-2xl overflow-hidden border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-gold/10"
                >
                  <div>
                    {/* Thumbnail & Badges */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            course.accessType === 'FREE'
                              ? 'bg-emerald-500/90 text-white shadow-md shadow-emerald-500/30'
                              : 'bg-gold text-bg shadow-md shadow-gold/30'
                          }`}
                        >
                          {course.accessType}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-bg/80 backdrop-blur-md text-white/90 border border-white/10">
                          {course.level}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-bg/80 backdrop-blur-md text-[11px] font-mono text-gold flex items-center gap-1">
                        <span>★</span> {course.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-white/40 mb-3 font-mono">
                        <span>⏱️ {course.duration}</span>
                        <span>•</span>
                        <span>👥 {course.totalStudents.toLocaleString()} Traders</span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors duration-200 mb-2 leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-6">
                        {course.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructorName}
                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                      />
                      <span className="text-xs text-white/70 font-medium truncate max-w-[110px]">
                        {course.instructorName}
                      </span>
                    </div>

                    <Link to={`/courses/${course.slug}`}>
                      <Button variant="gold" size="sm">
                        Start Course →
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Prop Firm Matchmaker Recommendation Section */}
          <div className="mt-20 glass rounded-3xl p-8 md:p-12 border border-gold/30 relative overflow-hidden bg-gradient-to-r from-gold/10 via-transparent to-emerald-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">⚡ Challenge Accelerator</span>
                <h2 className="text-3xl font-extrabold text-white mt-1 mb-3">
                  Ready to test your strategy on a Funded Account?
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Compare top proprietary trading firms like FTMO, Funding Pips, and Forex Funds with verified rules, profit splits up to 90%, and tight spread conditions.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/prop-firms">
                  <Button variant="gold" size="lg">
                    Compare Prop Firms →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
