import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageVariants } from '../../animations/variants'

export default function NotFoundPage() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="section-container text-center py-20">
        {/* Glowing 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <span
            className="font-heading font-black text-[10rem] md:text-[16rem] leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, rgba(255,215,0,0.1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 60px rgba(255,215,0,0.3))',
            }}
          >
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-white/40 text-lg mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="relative inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer select-none px-8 py-3.5 text-base rounded-2xl gap-2 w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #F5D36B 0%, #DDA73C 45%, #996D19 100%)',
                color: '#030303',
                fontWeight: 700,
                boxShadow: '0 0 14px rgba(221,167,60,0.25)',
              }}
            >
              Back to Home
            </Link>
            <Link 
              to="/contact" 
              className="relative inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer select-none px-8 py-3.5 text-base rounded-2xl gap-2 w-full sm:w-auto bg-transparent border text-[#FFB800] hover:bg-[#FFB800]/5"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
