import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../ui/Card'
import { TICKER_SYMBOLS } from '../../constants'

export function ProfitCalculator() {
  const [tradeSizeLots, setTradeSizeLots] = useState<number>(1)
  const [entryPrice, setEntryPrice] = useState<number>(1.0850)
  const [exitPrice, setExitPrice] = useState<number>(1.0900)
  const [positionType, setPositionType] = useState<'BUY' | 'SELL'>('BUY')
  const [pair, setPair] = useState<string>('EUR/USD')

  // Results
  const [profitAmount, setProfitAmount] = useState<number>(0)
  const [pipDifference, setPipDifference] = useState<number>(0)

  useEffect(() => {
    // 1. Calculate Pip Difference
    let diff = 0
    if (positionType === 'BUY') {
      diff = exitPrice - entryPrice
    } else {
      diff = entryPrice - exitPrice
    }
    
    // Determine pip multiplier based on pair
    const isJpyPair = pair.includes('JPY')
    const multiplier = isJpyPair ? 100 : 10000
    const pips = diff * multiplier
    
    setPipDifference(pips)

    // 2. Determine Pip Value per Standard Lot
    let pipValuePerLot = 10
    
    if (pair.endsWith('/USD')) {
      pipValuePerLot = 10
    } else if (pair === 'USD/JPY') {
      const jpyRate = TICKER_SYMBOLS.find(t => t.symbol === 'USD/JPY')?.value || 150
      pipValuePerLot = 1000 / jpyRate
    } else if (pair.startsWith('USD/')) {
      pipValuePerLot = 10 / 1.36
    }

    // 3. Calculate Profit
    const profit = pips * pipValuePerLot * tradeSizeLots
    setProfitAmount(profit)
    
  }, [tradeSizeLots, entryPrice, exitPrice, positionType, pair])

  const isProfit = profitAmount >= 0

  return (
    <Card glow className="p-6 md:p-8 max-w-2xl mx-auto border-t-2 border-t-[#00D084]">
      <div className="mb-6 border-b border-[#00D084]/20 pb-4">
        <h3 className="font-heading text-2xl font-bold text-white mb-2">Profit Calculator</h3>
        <p className="text-white/50 text-sm">Calculate exactly how much profit or loss a trade will generate.</p>
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

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPositionType('BUY')}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                positionType === 'BUY' 
                  ? 'bg-[#00D084]/20 text-[#00D084] border border-[#00D084]' 
                  : 'bg-white/5 text-white/50 border border-transparent'
              }`}
            >
              BUY (Long)
            </button>
            <button
              onClick={() => setPositionType('SELL')}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                positionType === 'SELL' 
                  ? 'bg-[#FF4D4F]/20 text-[#FF4D4F] border border-[#FF4D4F]' 
                  : 'bg-white/5 text-white/50 border border-transparent'
              }`}
            >
              SELL (Short)
            </button>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Trade Size (Lots)</label>
            <input 
              type="number" 
              value={tradeSizeLots} 
              onChange={(e) => setTradeSizeLots(Number(e.target.value))}
              className="input-premium focus:border-[#00D084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.1)]"
              min="0.01" step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-1">Entry Price</label>
              <input 
                type="number" 
                value={entryPrice} 
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="input-premium"
                min="0" step="0.0001"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-1">Exit Price</label>
              <input 
                type="number" 
                value={exitPrice} 
                onChange={(e) => setExitPrice(Number(e.target.value))}
                className="input-premium"
                min="0" step="0.0001"
              />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-[#030303] rounded-2xl p-6 border border-[#00D084]/10 flex flex-col justify-center items-center text-center gap-6">
          
          <div>
            <p className="text-white/40 uppercase tracking-widest text-xs font-semibold mb-1">Pip Difference</p>
            <p className={`font-heading text-2xl font-bold ${isProfit ? 'text-[#00D084]' : 'text-[#FF4D4F]'}`}>
              {pipDifference > 0 ? '+' : ''}{pipDifference.toLocaleString(undefined, { maximumFractionDigits: 1 })} Pips
            </p>
          </div>

          <div className="h-px w-full bg-[#00D084]/20" />

          <div>
            <p className="text-white/40 uppercase tracking-widest text-xs font-semibold mb-1">Total P/L (USD)</p>
            <motion.p 
              key={profitAmount}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`font-heading text-5xl font-black ${isProfit ? 'text-[#00D084] drop-shadow-[0_0_15px_rgba(0,208,132,0.3)]' : 'text-[#FF4D4F] drop-shadow-[0_0_15px_rgba(255,77,79,0.3)]'}`}
            >
              {profitAmount > 0 ? '+' : ''}${profitAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
          </div>
        </div>
      </div>
    </Card>
  )
}
