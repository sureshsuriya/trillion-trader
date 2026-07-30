import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PositionSizeCalculator } from './PositionSizeCalculator'
import { PipValueCalculator } from './PipValueCalculator'
import { RiskRewardCalculator } from './RiskRewardCalculator'
import { MarginCalculator } from './MarginCalculator'
import { ProfitCalculator } from './ProfitCalculator'
import { CompoundingCalculator } from './CompoundingCalculator'

const TABS = [
  { id: 'position-size', label: 'Position Size' },
  { id: 'pip-value', label: 'Pip Value' },
  { id: 'risk-reward', label: 'Risk / Reward' },
  { id: 'margin', label: 'Margin' },
  { id: 'profit', label: 'Profit' },
  { id: 'compound', label: 'Compounding' },
]

export function CalculatorsContainer() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)

  return (
    <div className="w-full">
      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-[#DDA73C]/10 border border-[#DDA73C]/50 text-[#F5D36B] shadow-[0_0_15px_rgba(221,167,60,0.15)]' 
                : 'bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CALCULATOR AREA */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'position-size' && <PositionSizeCalculator />}
            {activeTab === 'pip-value' && <PipValueCalculator />}
            {activeTab === 'risk-reward' && <RiskRewardCalculator />}
            {activeTab === 'margin' && <MarginCalculator />}
            {activeTab === 'profit' && <ProfitCalculator />}
            {activeTab === 'compound' && <CompoundingCalculator />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
