import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../../components/ui/Card'

export function CompoundingCalculator() {
  const [startingBalance, setStartingBalance] = useState<number>(1000)
  const [monthlyGainPercent, setMonthlyGainPercent] = useState<number>(5)
  const [months, setMonths] = useState<number>(12)

  // Results
  const [endingBalance, setEndingBalance] = useState<number>(0)
  const [totalProfit, setTotalProfit] = useState<number>(0)

  useEffect(() => {
    // Formula: A = P(1 + r/n)^(nt)
    // For simple monthly compounding where n=1 (compounded monthly) and t = months
    // A = P(1 + r)^m
    
    const rate = monthlyGainPercent / 100
    const finalAmount = startingBalance * Math.pow(1 + rate, months)
    
    setEndingBalance(finalAmount)
    setTotalProfit(finalAmount - startingBalance)
    
  }, [startingBalance, monthlyGainPercent, months])

  return (
    <Card glow className="p-6 md:p-8 max-w-2xl mx-auto border-t-2 border-t-[#DDA73C]">
      <div className="mb-6 border-b border-[#DDA73C]/20 pb-4">
        <h3 className="font-heading text-2xl font-bold text-white mb-2">Compounding Calculator</h3>
        <p className="text-white/50 text-sm">See the power of compound interest and project your account growth over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* INPUTS */}
        <div className="space-y-4 flex flex-col justify-center">
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Starting Balance ($)</label>
            <input 
              type="number" 
              value={startingBalance} 
              onChange={(e) => setStartingBalance(Number(e.target.value))}
              className="input-premium focus:border-[#DDA73C] focus:shadow-[0_0_0_3px_rgba(221,167,60,0.1)]"
              min="0"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Monthly Gain (%)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0.5" max="30" step="0.5" 
                value={monthlyGainPercent} 
                onChange={(e) => setMonthlyGainPercent(Number(e.target.value))}
                className="w-full accent-[#DDA73C]"
              />
              <span className="text-[#DDA73C] font-bold min-w-[3rem] text-right">{monthlyGainPercent}%</span>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Duration (Months)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" max="60" step="1" 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-[#DDA73C]"
              />
              <span className="text-[#DDA73C] font-bold min-w-[3rem] text-right">{months}</span>
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-[#030303] rounded-2xl p-6 border border-[#DDA73C]/10 flex flex-col justify-center gap-6">
          <div className="flex justify-between items-center">
            <span className="text-white/40 uppercase tracking-widest text-xs font-semibold">Total Profit</span>
            <span className="font-heading text-xl font-bold text-[#00D084]">
              +${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/40 uppercase tracking-widest text-xs font-semibold">Return on Investment</span>
            <span className="font-heading text-xl font-bold text-[#F5D36B]">
              {((totalProfit / startingBalance) * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%
            </span>
          </div>

          <div className="h-px w-full bg-[#DDA73C]/20" />

          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Ending Balance</p>
            <motion.p 
              key={endingBalance}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-heading text-4xl font-black gradient-text"
            >
              ${endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
          </div>
        </div>
      </div>
    </Card>
  )
}
