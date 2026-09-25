import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { paymentApi } from '../../api/paymentApi'
import { Button } from './Button'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'ANNUAL' | 'LIFETIME'>('ANNUAL')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const res = await paymentApi.createCheckoutSession(selectedPlan)
      if (res && res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      }
    } catch (err) {
      console.error('Failed to launch Stripe Checkout:', err)
      alert('Unable to launch checkout session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl glass rounded-3xl p-6 md:p-10 border border-gold/40 shadow-2xl overflow-hidden bg-bg/95"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white"
          >
            ✕
          </button>

          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-gold/20 text-gold uppercase tracking-wider">
              ⚡ Unlock Pro Trader Access
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Choose Your Academy <span className="gold-gradient-text">Membership Plan</span>
            </h2>
            <p className="text-white/60 text-xs md:text-sm mt-2">
              Gain instant unlimited access to all video courses, downloadable trade loggers, end-of-module quizzes, and VIP Discord trade setups.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Monthly */}
            <div
              onClick={() => setSelectedPlan('MONTHLY')}
              className={`cursor-pointer rounded-2xl p-6 border transition-all relative flex flex-col justify-between ${
                selectedPlan === 'MONTHLY'
                  ? 'bg-gold/10 border-gold shadow-lg shadow-gold/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Monthly Pass</h3>
                <p className="text-xs text-white/40 mb-4">Flexible monthly billing</p>
                <div className="text-3xl font-extrabold text-white font-mono mb-4">
                  $29 <span className="text-xs text-white/40 font-normal">/ month</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-white/70 mb-6">
                <li>✓ Access to all courses</li>
                <li>✓ Standard video quality</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mx-auto ${selectedPlan === 'MONTHLY' ? 'border-gold bg-gold' : 'border-white/40'}`}>
                {selectedPlan === 'MONTHLY' && <span className="text-bg text-[10px] font-bold">✓</span>}
              </div>
            </div>

            {/* Annual (POPULAR) */}
            <div
              onClick={() => setSelectedPlan('ANNUAL')}
              className={`cursor-pointer rounded-2xl p-6 border transition-all relative flex flex-col justify-between ${
                selectedPlan === 'ANNUAL'
                  ? 'bg-gold/15 border-gold shadow-xl shadow-gold/30 scale-105'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold text-bg">
                Best Value (Save 42%)
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Annual Pass</h3>
                <p className="text-xs text-white/40 mb-4">Billed once a year</p>
                <div className="text-3xl font-extrabold text-gold font-mono mb-4">
                  $199 <span className="text-xs text-white/40 font-normal">/ year</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-white/80 mb-6">
                <li>✓ Unlimited course access</li>
                <li>✓ Downloadable trade journals</li>
                <li>✓ VIP Discord Trading Signals</li>
                <li>✓ Completion Certificates</li>
              </ul>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mx-auto ${selectedPlan === 'ANNUAL' ? 'border-gold bg-gold' : 'border-white/40'}`}>
                {selectedPlan === 'ANNUAL' && <span className="text-bg text-[10px] font-bold">✓</span>}
              </div>
            </div>

            {/* Lifetime */}
            <div
              onClick={() => setSelectedPlan('LIFETIME')}
              className={`cursor-pointer rounded-2xl p-6 border transition-all relative flex flex-col justify-between ${
                selectedPlan === 'LIFETIME'
                  ? 'bg-gold/10 border-gold shadow-lg shadow-gold/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Lifetime Pass</h3>
                <p className="text-xs text-white/40 mb-4">One-time payment forever</p>
                <div className="text-3xl font-extrabold text-white font-mono mb-4">
                  $499 <span className="text-xs text-white/40 font-normal">one-time</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-white/70 mb-6">
                <li>✓ Lifetime access to everything</li>
                <li>✓ 1-on-1 Strategy Mentorship</li>
                <li>✓ All future courses included</li>
              </ul>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mx-auto ${selectedPlan === 'LIFETIME' ? 'border-gold bg-gold' : 'border-white/40'}`}>
                {selectedPlan === 'LIFETIME' && <span className="text-bg text-[10px] font-bold">✓</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button variant="gold" size="lg" isLoading={loading} onClick={handleCheckout}>
              Proceed to Stripe Checkout →
            </Button>
            <p className="text-[11px] text-white/40 font-mono">
              🔒 256-Bit Encrypted Stripe Payment. 14-Day Money-Back Guarantee.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
