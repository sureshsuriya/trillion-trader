import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../../components/ui/Card'
import { useLiveRates } from '../../../hooks/useLiveRates'

export function PipValueCalculator() {
  const rates = useLiveRates()
  const [tradeSizeLots, setTradeSizeLots] = useState<number>(1)
  const [pair, setPair] = useState<string>('EUR/USD')

  // Results
  const [pipValue, setPipValue] = useState<number>(10)

  useEffect(() => {
    let basePipValue = 10 // default for XXX/USD
    
    if (pair.endsWith('/USD')) {
      basePipValue = 10
    } else if (pair === 'USD/JPY') {
      const jpyRate = rates['USD/JPY'] ?? 150
      basePipValue = 1000 / jpyRate
    } else if (pair.startsWith('USD/')) {
      basePipValue = 10 / 1.36 // rough placeholder for CAD/CHF
    }

    setPipValue(basePipValue * tradeSizeLots)
  }, [tradeSizeLots, pair, rates])

  return (
    <Card glow className="p-6 md:p-8 max-w-2xl mx-auto border-t-2 border-t-[#00D084]">
      <div className="mb-6 border-b border-[#00D084]/20 pb-4">
        <h3 className="font-heading text-2xl font-bold text-white mb-2">Pip Value Calculator</h3>
        <p className="text-white/50 text-sm">Find out exactly how much each pip is worth before you enter a trade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Currency Pair</label>
            <select 
              value={pair} 
              onChange={(e) => setPair(e.target.value)}
              className="input-premium appearance-none bg-[#0A0A0A] focus:border-[#00D084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.1)]"
            >
              <option value="EUR/USD">EUR/USD</option>
              <option value="GBP/USD">GBP/USD</option>
              <option value="AUD/USD">AUD/USD</option>
              <option value="NZD/USD">NZD/USD</option>
              <option value="USD/JPY">USD/JPY</option>
              <option value="USD/CAD">USD/CAD</option>
              <option value="USD/CHF">USD/CHF</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Trade Size (Lots)</label>
            <input 
              type="number" 
              value={tradeSizeLots} 
              onChange={(e) => setTradeSizeLots(Number(e.target.value))}
              className="input-premium focus:border-[#00D084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.1)]"
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-[#030303] rounded-2xl p-6 border border-[#00D084]/10 flex flex-col justify-center items-center text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Value Per Pip</p>
          <motion.p 
            key={pipValue}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-heading text-6xl font-black gradient-text-accent"
          >
            ${pipValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.p>
        </div>
      </div>
    </Card>
  )
}
