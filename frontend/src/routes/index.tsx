import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from '../layouts/Navbar'
import { Footer } from '../layouts/Footer'
import { SEO } from '../components/ui/SEO'

// Lazy-loaded pages
const HomePage = lazy(() => import('../pages/Home'))
const AboutPage = lazy(() => import('../pages/About'))
const ServicesPage = lazy(() => import('../pages/Services'))
const TradingToolsPage = lazy(() => import('../pages/TradingTools'))
const PropFirmsPage = lazy(() => import('../pages/PropFirms'))
const BrokersPage = lazy(() => import('../pages/Brokers'))
const ResourcesPage = lazy(() => import('../pages/Resources'))
const BlogPage = lazy(() => import('../pages/Blog'))
const TestimonialsPage = lazy(() => import('../pages/Testimonials'))
const FAQPage = lazy(() => import('../pages/FAQ'))
const ContactPage = lazy(() => import('../pages/Contact'))
const DisclaimerPage = lazy(() => import('../pages/Legal/Disclaimer'))
const PrivacyPage = lazy(() => import('../pages/Legal/Privacy'))
const TermsPage = lazy(() => import('../pages/Legal/Terms'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))

// Courses Pages
const CoursesPage = lazy(() => import('../pages/Courses'))
const CourseDetailPage = lazy(() => import('../pages/Courses/CourseDetail'))
const LessonViewerPage = lazy(() => import('../pages/Courses/LessonViewer'))

// Admin Pages
const AdminLogin = lazy(() => import('../pages/admin/Login'))
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'))
const ManageBlogs = lazy(() => import('../pages/admin/ManageBlogs'))
const ManageCategories = lazy(() => import('../pages/admin/ManageCategories'))
const ManageBrokers = lazy(() => import('../pages/admin/ManageBrokers'))
const ManagePropFirms = lazy(() => import('../pages/admin/ManagePropFirms'))
const ManageCourses = lazy(() => import('../pages/admin/ManageCourses'))
const ManageResources = lazy(() => import('../pages/admin/ManageResources'))
const ManageTestimonials = lazy(() => import('../pages/admin/ManageTestimonials'))
const ManageFAQ = lazy(() => import('../pages/admin/ManageFAQ'))
const ManageSettings = lazy(() => import('../pages/admin/ManageSettings'))

import { AdminLayout } from '../layouts/AdminLayout'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white/30 text-sm font-mono">Loading...</p>
      </div>
    </div>
  )
}

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonViewerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/tools" element={<TradingToolsPage />} />
          <Route path="/prop-firms" element={<PropFirmsPage />} />
          <Route path="/brokers" element={<BrokersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

// Public Layout Wrapper
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg relative">
      <SEO />
      <Navbar />
      <div className="flex-1 pt-16">
        <AnimatedRoutes />
      </div>
      <Footer />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="brokers" element={<ManageBrokers />} />
              <Route path="prop-firms" element={<ManagePropFirms />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="resources" element={<ManageResources />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="faqs" element={<ManageFAQ />} />
              <Route path="settings" element={<ManageSettings />} />
            </Route>
          </Route>

          {/* Public Routes - Match all remaining */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
