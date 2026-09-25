import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { coursesApi, type Course } from '../../api/coursesApi'
import { Button } from '../../components/ui/Button'
import { SEO } from '../../components/ui/SEO'

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [openModuleIndex, setOpenModuleIndex] = useState<number>(0)

  useEffect(() => {
    if (!slug) return
    coursesApi
      .getCourseBySlug(slug)
      .then((data) => {
        if (data) setCourse(data)
      })
      .catch(() => {
        // Fallback demo data if backend connection issue
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm font-mono">Loading Course Curriculum...</p>
        </div>
      </div>
    )
  }

  // Fallback demo course if API not available
  const displayCourse: Course = course || {
    id: '1',
    title: 'Forex & Price Action Foundations 101',
    slug: 'forex-price-action-foundations-101',
    shortDescription: 'Master candlestick patterns, market structure, support/resistance, and risk management fundamentals.',
    description:
      'The ultimate beginner course for traders entering the Forex and Stock markets. Learn how to read raw price charts without lagging indicators, manage capital like an institutional pro, and execute high-probability setups with confidence.',
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
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Market Mechanics & Candlestick Anatomy',
        description: 'Understand who moves the markets and how to interpret price candles.',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-1',
            title: '1.1 Introduction to Currency Pairs & Pip Math',
            slug: 'intro-to-currency-pairs',
            duration: '12m',
            freePreview: true,
            orderIndex: 1,
          },
          {
            id: 'les-2',
            title: '1.2 Decoding Market Trends & Structure (HH/HL)',
            slug: 'decoding-market-trends',
            duration: '18m',
            freePreview: true,
            orderIndex: 2,
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Key Levels & Execution',
        description: 'Master horizontal support, resistance, key liquidity zones, and order entry.',
        orderIndex: 2,
        lessons: [
          {
            id: 'les-3',
            title: '2.1 Drawing Valid Support & Resistance Zones',
            slug: 'drawing-support-resistance',
            duration: '22m',
            freePreview: false,
            orderIndex: 1,
          },
        ],
      },
    ],
  }

  const firstLessonSlug =
    displayCourse.modules.length > 0 && displayCourse.modules[0].lessons.length > 0
      ? displayCourse.modules[0].lessons[0].slug
      : ''

  return (
    <>
      <SEO title={`${displayCourse.title} | Trillion Traders Academy`} description={displayCourse.shortDescription} />

      <div className="py-12 md:py-20 relative">
        <div className="section-container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-8">
            <Link to="/courses" className="hover:text-gold transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-gold">{displayCourse.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Header Badges & Title */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-gold text-bg">
                    {displayCourse.accessType}
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-white/10 text-white border border-white/10">
                    {displayCourse.level}
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {displayCourse.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                  {displayCourse.title}
                </h1>

                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                  {displayCourse.description}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="glass rounded-xl p-4 mb-10 border border-white/10 flex flex-wrap items-center justify-around gap-4 text-center">
                <div>
                  <div className="text-xs text-white/40 font-mono">RATING</div>
                  <div className="text-lg font-bold text-gold">★ {displayCourse.rating.toFixed(1)}</div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <div>
                  <div className="text-xs text-white/40 font-mono">STUDENTS</div>
                  <div className="text-lg font-bold text-white">{displayCourse.totalStudents.toLocaleString()}</div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <div>
                  <div className="text-xs text-white/40 font-mono">TOTAL DURATION</div>
                  <div className="text-lg font-bold text-white">{displayCourse.duration}</div>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="glass rounded-2xl p-6 mb-10 border border-white/10 flex items-center gap-4">
                <img
                  src={displayCourse.instructorAvatar}
                  alt={displayCourse.instructorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold/50"
                />
                <div>
                  <div className="text-xs text-gold font-mono uppercase font-semibold">Course Instructor</div>
                  <h3 className="text-lg font-bold text-white">{displayCourse.instructorName}</h3>
                  <p className="text-white/60 text-xs">{displayCourse.instructorTitle}</p>
                </div>
              </div>

              {/* Course Curriculum Accordion */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {displayCourse.modules.map((mod, modIdx) => (
                    <div
                      key={mod.id || modIdx}
                      className="glass rounded-xl border border-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenModuleIndex(openModuleIndex === modIdx ? -1 : modIdx)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left"
                      >
                        <div>
                          <h4 className="text-base font-bold text-white">{mod.title}</h4>
                          {mod.description && <p className="text-xs text-white/50 mt-0.5">{mod.description}</p>}
                        </div>
                        <span className="text-gold font-mono text-sm ml-4">
                          {openModuleIndex === modIdx ? '−' : '+'}
                        </span>
                      </button>

                      {openModuleIndex === modIdx && (
                        <div className="p-4 space-y-2 border-t border-white/5 bg-bg/40">
                          {mod.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              to={`/courses/${displayCourse.slug}/lessons/${lesson.slug}`}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center font-mono">
                                  ▶
                                </span>
                                <div>
                                  <div className="text-sm font-medium text-white group-hover:text-gold transition-colors">
                                    {lesson.title}
                                  </div>
                                  {lesson.duration && (
                                    <div className="text-[11px] text-white/40 font-mono">Duration: {lesson.duration}</div>
                                  )}
                                </div>
                              </div>

                              <div>
                                {lesson.freePreview ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                                    Free Preview
                                  </span>
                                ) : (
                                  <span className="text-white/40 text-xs">🔒 Locked</span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Sticky Card */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 border border-gold/30 sticky top-24 shadow-2xl backdrop-blur-xl">
                <div className="relative rounded-xl overflow-hidden mb-6 aspect-video">
                  <img
                    src={displayCourse.thumbnailUrl}
                    alt={displayCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Link to={`/courses/${displayCourse.slug}/lessons/${firstLessonSlug}`}>
                      <div className="w-14 h-14 rounded-full bg-gold text-bg flex items-center justify-center font-bold text-xl shadow-lg shadow-gold/40 hover:scale-110 transition-transform">
                        ▶
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="text-2xl font-extrabold text-white mb-2">
                  {displayCourse.accessType === 'FREE' ? 'Free Access' : 'Included in Pro'}
                </div>

                <p className="text-white/60 text-xs mb-6 leading-relaxed">
                  Full lifetime access to HD video lessons, downloadable resources, and end-of-module quizzes.
                </p>

                <Link to={`/courses/${displayCourse.slug}/lessons/${firstLessonSlug}`} className="block w-full">
                  <Button variant="gold" size="lg" fullWidth>
                    Start Learning Now →
                  </Button>
                </Link>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Complete Video Syllabus
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Interactive Knowledge Quizzes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Certificate of Completion
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Discord Community Access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
