import { motion } from 'framer-motion'
import { pageVariants, sectionHeaderVariants } from '../../animations/variants'

export default function Page() {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className="section-padding min-h-screen">
        <div className="section-container">
          <motion.div variants={sectionHeaderVariants} initial="hidden" animate="visible" className="text-center pt-16">
            <span className="badge mb-4">Coming Soon</span>
            <h1 className="font-heading text-5xl md:text-6xl font-black text-white mb-6">
              <span className="gradient-text">Testimonials</span>
            </h1>
            <p className="text-white/45 text-lg max-w-2xl mx-auto">Real stories from real traders in our community.</p>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}
