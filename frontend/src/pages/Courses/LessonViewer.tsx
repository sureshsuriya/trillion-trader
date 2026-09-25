import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { coursesApi, type Course, type Lesson, type QuizQuestion } from '../../api/coursesApi'
import { Button } from '../../components/ui/Button'
import { SEO } from '../../components/ui/SEO'

export default function LessonViewerPage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!courseSlug) return
    coursesApi
      .getCourseBySlug(courseSlug)
      .then((data) => {
        setCourse(data)
        // Fetch progress
        coursesApi.getUserProgress(data.id).then((p) => {
          if (p && p.completedLessonIds) {
            setCompletedLessonIds(new Set(p.completedLessonIds))
          }
        })
      })
      .catch(() => {
        // demo fallback handled below
      })
  }, [courseSlug])

  // Fallback course data if API offline
  const displayCourse: Course = course || {
    id: '1',
    title: 'Forex & Price Action Foundations 101',
    slug: 'forex-price-action-foundations-101',
    shortDescription: 'Master candlestick patterns, market structure, support/resistance.',
    description: '',
    thumbnailUrl: '',
    level: 'BEGINNER',
    category: 'FOREX',
    accessType: 'FREE',
    duration: '3h 45m',
    rating: 4.9,
    totalStudents: 1240,
    published: true,
    instructorName: 'Alexander Reed',
    instructorTitle: 'Senior Market Strategist',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Market Mechanics & Candlestick Anatomy',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-1',
            title: '1.1 Introduction to Currency Pairs & Pip Math',
            slug: 'intro-to-currency-pairs',
            duration: '12m',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            contentHtml:
              '<h3>Lesson Overview</h3><p>Welcome to <strong>Trillion Traders Academy</strong>! In this lesson, we break down currency pairs, base vs quote currency, and pip calculations.</p><h4>Key Takeaways:</h4><ul><li>Standard lot size = 100,000 units ($10 per pip on EUR/USD)</li><li>Mini lot size = 10,000 units ($1 per pip)</li><li>Micro lot size = 1,000 units ($0.10 per pip)</li></ul>',
            freePreview: true,
            orderIndex: 1,
            quiz: [
              {
                question: 'What is a "Pip" in Forex trading?',
                options: [
                  'Percentage in Point (standardized unit of price change)',
                  'Profit in Percentage',
                  'Price Index Pointer',
                  'Position Initial Price',
                ],
                correctOptionIndex: 0,
                explanation: 'A pip stands for Percentage in Point and measures the smallest price change in currency quotes.',
              },
            ],
          },
          {
            id: 'les-2',
            title: '1.2 Decoding Market Trends & Structure (HH/HL)',
            slug: 'decoding-market-trends',
            duration: '18m',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            contentHtml:
              '<h3>Market Structure Rules</h3><p>An uptrend consists of Higher Highs (HH) and Higher Lows (HL). A downtrend consists of Lower Highs (LH) and Lower Lows (LL).</p>',
            freePreview: true,
            orderIndex: 2,
          },
        ],
      },
    ],
  }

  // Find active lesson
  useEffect(() => {
    if (!displayCourse) return
    let found: Lesson | null = null
    for (const mod of displayCourse.modules) {
      const match = mod.lessons.find((l) => l.slug === lessonSlug)
      if (match) {
        found = match
        break
      }
    }
    if (!found && displayCourse.modules.length > 0 && displayCourse.modules[0].lessons.length > 0) {
      found = displayCourse.modules[0].lessons[0]
    }
    setCurrentLesson(found)
    setQuizAnswers({})
    setQuizSubmitted(false)
  }, [lessonSlug, displayCourse])

  // Flatten all lessons to enable Next/Prev buttons
  const allLessons: Lesson[] = displayCourse.modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.slug === (currentLesson?.slug || ''))
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const handleMarkComplete = () => {
    if (!currentLesson) return
    const newSet = new Set(completedLessonIds)
    newSet.add(currentLesson.id)
    setCompletedLessonIds(newSet)

    // Save to API
    coursesApi.completeLesson(displayCourse.id, currentLesson.id).catch(() => {})

    // Auto navigate to next lesson if available
    if (nextLesson) {
      navigate(`/courses/${displayCourse.slug}/lessons/${nextLesson.slug}`)
    }
  }

  return (
    <>
      <SEO
        title={`${currentLesson?.title || 'Lesson'} | ${displayCourse.title}`}
        description="Watch step-by-step video lesson and complete knowledge quiz."
      />

      <div className="min-h-screen bg-bg text-white flex flex-col pt-16">
        {/* Top LMS Bar */}
        <div className="bg-surface border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/courses/${displayCourse.slug}`}
              className="text-xs text-white/60 hover:text-gold transition-colors font-mono flex items-center gap-1"
            >
              ← Back to Course
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-sm font-bold text-white truncate max-w-xs md:max-w-md">
              {displayCourse.title}
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/10 font-mono"
          >
            {sidebarOpen ? 'Hide Syllabus ✕' : 'Show Syllabus ☰'}
          </button>
        </div>

        {/* Player Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Video & Content Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Video Frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl mb-8">
                {currentLesson?.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 p-6 text-center">
                    <span className="text-4xl mb-2">🎥</span>
                    <p className="text-white/60 text-sm">Video Stream Ready</p>
                  </div>
                )}
              </div>

              {/* Lesson Title & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                    {currentLesson?.title}
                  </h1>
                  <p className="text-xs text-white/50 font-mono">Duration: {currentLesson?.duration || '15m'}</p>
                </div>

                <div className="flex items-center gap-3">
                  {prevLesson && (
                    <Link to={`/courses/${displayCourse.slug}/lessons/${prevLesson.slug}`}>
                      <Button variant="ghost" size="sm">
                        ← Prev
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant={completedLessonIds.has(currentLesson?.id || '') ? 'outline' : 'gold'}
                    size="sm"
                    onClick={handleMarkComplete}
                  >
                    {completedLessonIds.has(currentLesson?.id || '') ? '✓ Completed' : 'Complete & Next →'}
                  </Button>
                </div>
              </div>

              {/* Lesson HTML Content */}
              {currentLesson?.contentHtml && (
                <div className="glass rounded-2xl p-6 md:p-8 border border-white/10 mb-10 prose prose-invert max-w-none text-white/80">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.contentHtml }} />
                </div>
              )}

              {/* Interactive Quiz Section */}
              {currentLesson?.quiz && currentLesson.quiz.length > 0 && (
                <div className="glass rounded-2xl p-6 md:p-8 border border-gold/30 mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xl">💡</span>
                    <h3 className="text-xl font-bold text-white">Lesson Quiz & Knowledge Check</h3>
                  </div>

                  <div className="space-y-6">
                    {currentLesson.quiz.map((q: QuizQuestion, qIdx: number) => (
                      <div key={qIdx} className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-sm font-semibold text-white mb-3">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt: string, optIdx: number) => {
                            const isSelected = quizAnswers[qIdx] === optIdx
                            const isCorrect = q.correctOptionIndex === optIdx

                            let btnStyle = 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                            if (quizSubmitted) {
                              if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold'
                              else if (isSelected && !isCorrect) btnStyle = 'bg-red-500/20 border-red-500/50 text-red-400'
                            } else if (isSelected) {
                              btnStyle = 'bg-gold/20 border-gold text-gold font-bold'
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                                className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="mt-3 p-3 rounded bg-bg/60 text-xs text-white/70 border border-white/10 font-mono">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    {!quizSubmitted ? (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(quizAnswers).length < currentLesson.quiz.length}
                      >
                        Submit Answers
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setQuizSubmitted(false)}>
                        Retake Quiz
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Syllabus Drawer / Sidebar */}
          {sidebarOpen && (
            <div className="w-full lg:w-80 bg-surface border-l border-white/10 overflow-y-auto p-4 flex-shrink-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">
                Course Syllabus
              </h3>

              <div className="space-y-4">
                {displayCourse.modules.map((mod) => (
                  <div key={mod.id} className="space-y-2">
                    <div className="text-xs font-bold text-gold uppercase tracking-wider px-2">
                      {mod.title}
                    </div>
                    <div className="space-y-1">
                      {mod.lessons.map((les) => {
                        const isActive = les.slug === currentLesson?.slug
                        const isDone = completedLessonIds.has(les.id)

                        return (
                          <Link
                            key={les.id}
                            to={`/courses/${displayCourse.slug}/lessons/${les.slug}`}
                            className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors ${
                              isActive
                                ? 'bg-gold/15 text-gold font-bold border border-gold/30'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span>{isDone ? '✅' : '⚪'}</span>
                              <span className="truncate">{les.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-white/40">{les.duration}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
