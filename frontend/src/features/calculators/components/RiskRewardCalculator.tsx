import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../../components/ui/Card'
import { TICKER_SYMBOLS } from '../../../constants/index'

export function RiskRewardCalculator() {
  const [stopLossPips, setStopLossPips] = useState<number>(20)
  const [takeProfitPips, setTakeProfitPips] = useState<number>(60)
  const [tradeSizeLots, setTradeSizeLots] = useState<number>(1)
  const [pair, setPair] = useState<string>('EUR/USD')

  // Results
  const [riskAmount, setRiskAmount] = useState<number>(0)
  const [rewardAmount, setRewardAmount] = useState<number>(0)
  const [rrRatio, setRrRatio] = useState<number>(0)

  useEffect(() => {
    let pipValuePerLot = 10
    
    if (pair.endsWith('/USD')) {
      pipValuePerLot = 10
    } else if (pair === 'USD/JPY') {
      const jpyRate = TICKER_SYMBOLS.find(t => t.symbol === 'USD/JPY')?.value || 150
      pipValuePerLot = 1000 / jpyRate
    } else if (pair.startsWith('USD/')) {
      pipValuePerLot = 10 / 1.36
    }

    const valuePerPip = pipValuePerLot * tradeSizeLots
    
    const risk = stopLossPips * valuePerPip
    const reward = takeProfitPips * valuePerPip
    
    setRiskAmount(risk)
    setRewardAmount(reward)
    
    if (stopLossPips > 0) {
      setRrRatio(takeProfitPips / stopLossPips)
    } else {
      setRrRatio(0)
    }

  }, [stopLossPips, takeProfitPips, tradeSizeLots, pair])

  return (
    <Card glow className="p-6 md:p-8 max-w-2xl mx-auto border-t-2 border-t-[#3B82F6]">
      <div className="mb-6 border-b border-[#3B82F6]/20 pb-4">
        <h3 className="font-heading text-2xl font-bold text-white mb-2">Risk/Reward Calculator</h3>
        <p className="text-white/50 text-sm">Calculate your exact monetary risk and potential profit before execution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Currency Pair</label>
            <select 
              value={pair} 
              onChange={(e) => setPair(e.target.value)}
              className="input-premium appearance-none bg-[#0A0A0A] focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            >
              <option value="EUR/USD">EUR/USD</option>
              <option value="GBP/USD">GBP/USD</option>
              <option value="AUD/USD">AUD/USD</option>
              <option value="USD/JPY">USD/JPY</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Trade Size (Lots)</label>
            <input 
              type="number" 
              value={tradeSizeLots} 
              onChange={(e) => setTradeSizeLots(Number(e.target.value))}
              className="input-premium focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              min="0.01" step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-1">SL (Pips)</label>
              <input 
                type="number" 
                value={stopLossPips} 
                onChange={(e) => setStopLossPips(Number(e.target.value))}
                className="input-premium focus:border-[#FF4D4F] focus:shadow-[0_0_0_3px_rgba(255,77,79,0.1)]"
                min="0"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-1">TP (Pips)</label>
              <input 
                type="number" 
                value={takeProfitPips} 
                onChange={(e) => setTakeProfitPips(Number(e.target.value))}
                className="input-premium focus:border-[#00D084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.1)]"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-[#030303] rounded-2xl p-6 border border-[#3B82F6]/10 flex flex-col justify-center gap-6">
          <div className="flex justify-between items-center">
            <span className="text-white/40 uppercase tracking-widest text-xs font-semibold">Risk Amount</span>
            <span className="font-heading text-xl font-bold text-[#FF4D4F]">
              -${riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/40 uppercase tracking-widest text-xs font-semibold">Reward Amount</span>
            <span className="font-heading text-xl font-bold text-[#00D084]">
              +${rewardAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="h-px w-full bg-[#3B82F6]/20" />

          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Risk : Reward Ratio</p>
            <motion.p 
              key={rrRatio}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-heading text-4xl font-black text-[#3B82F6]"
            >
              1 : {rrRatio.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </motion.p>
          </div>
        </div>
      </div>
    </Card>
  )
}
