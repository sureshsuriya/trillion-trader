import { motion } from 'framer-motion'
import { pageVariants } from '../../animations/variants'
import { HeroSection } from '../../components/sections/HeroSection'
import { LiveTicker } from '../../components/sections/LiveTicker'
import { ServicesPreview, StatsSection, CTASection } from '../../components/sections/HomeSections'
import { MarketOverviewSection } from '../../components/sections/MarketOverview'
import { AcademyFeaturedSection } from '../../components/sections/AcademyFeaturedSection'

export default function HomePage() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* 1. HERO — Full 3D immersive section */}
      <HeroSection />

      {/* 2. LIVE TICKER — Pinned just below hero */}
      <LiveTicker />

      {/* 3. ACADEMY FEATURED COURSES */}
      <AcademyFeaturedSection />

      {/* 4. SERVICES PREVIEW */}
      <ServicesPreview />

      {/* 5. STATS */}
      <StatsSection />

      {/* 6. MARKET OVERVIEW — Big premium chart */}
      <MarketOverviewSection />

      {/* 7. CTA */}
      <CTASection />
    </motion.main>
  )
}
