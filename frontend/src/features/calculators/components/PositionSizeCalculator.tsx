import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../../components/ui/Card'
import { useLiveRates } from '../../../hooks/useLiveRates'

export function PositionSizeCalculator() {
  const rates = useLiveRates()
  const [accountBalance, setAccountBalance] = useState<number>(10000)
  const [riskPercent, setRiskPercent] = useState<number>(1)
  const [stopLossPips, setStopLossPips] = useState<number>(20)
  const [pair, setPair] = useState<string>('EUR/USD')

  // Results
  const [riskAmount, setRiskAmount] = useState<number>(0)
  const [positionSizeLots, setPositionSizeLots] = useState<number>(0)
  const [positionSizeUnits, setPositionSizeUnits] = useState<number>(0)

  useEffect(() => {
    // 1. Calculate Risk in Dollars
    const riskUsd = accountBalance * (riskPercent / 100)
    setRiskAmount(riskUsd)

    // 2. Determine Pip Value per Standard Lot (100,000 units)
    // For any XXX/USD pair (EUR/USD, GBP/USD, AUD/USD, NZD/USD), standard pip value is exactly $10.
    // For USD/JPY, it's roughly 1000 / exchange rate (e.g., 1000 / 156.22 = $6.40)
    // For simplicity in MVP, we estimate based on the TICKER_SYMBOLS constant.
    let pipValuePerLot = 10 // default for XXX/USD
    
    if (pair.endsWith('/USD')) {
      pipValuePerLot = 10
    } else if (pair === 'USD/JPY') {
      const jpyRate = rates['USD/JPY'] ?? 150
      pipValuePerLot = 1000 / jpyRate
    } else if (pair.startsWith('USD/')) {
      // e.g. USD/CAD
      pipValuePerLot = 10 / 1.36 // placeholder
    }

    // 3. Calculate Position Size
    // Risk Amount = Position Size in Lots * Stop Loss Pips * Pip Value Per Lot
    // Therefore: Position Size in Lots = Risk Amount / (Stop Loss Pips * Pip Value Per Lot)
    if (stopLossPips > 0 && pipValuePerLot > 0) {
      const lots = riskUsd / (stopLossPips * pipValuePerLot)
      setPositionSizeLots(lots)
      setPositionSizeUnits(lots * 100000)
    } else {
      setPositionSizeLots(0)
      setPositionSizeUnits(0)
    }
  }, [accountBalance, riskPercent, stopLossPips, pair, rates])

  return (
    <Card glow className="p-6 md:p-8 max-w-2xl mx-auto border-t-2 border-t-[#DDA73C]">
      <div className="mb-6 border-b border-[#DDA73C]/20 pb-4">
        <h3 className="font-heading text-2xl font-bold text-white mb-2">Position Size Calculator</h3>
        <p className="text-white/50 text-sm">Calculate exactly how many lots to trade based on your risk tolerance and stop loss.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Currency Pair</label>
            <select 
              value={pair} 
              onChange={(e) => setPair(e.target.value)}
              className="input-premium appearance-none bg-[#0A0A0A]"
            >
              <option value="EUR/USD">EUR/USD</option>
              <option value="GBP/USD">GBP/USD</option>
              <option value="AUD/USD">AUD/USD</option>
              <option value="NZD/USD">NZD/USD</option>
              <option value="USD/JPY">USD/JPY</option>
              <option value="USD/CAD">USD/CAD</option>
              <option value="USD/CHF">USD/CHF</option>
              <option value="XAU/USD">XAU/USD (Gold)</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Account Balance ($)</label>
            <input 
              type="number" 
              value={accountBalance} 
              onChange={(e) => setAccountBalance(Number(e.target.value))}
              className="input-premium"
              min="0"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Risk Percentage (%)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0.1" max="10" step="0.1" 
                value={riskPercent} 
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full accent-[#DDA73C]"
              />
              <span className="text-[#DDA73C] font-bold min-w-[3rem] text-right">{riskPercent}%</span>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Stop Loss (Pips)</label>
            <input 
              type="number" 
              value={stopLossPips} 
              onChange={(e) => setStopLossPips(Number(e.target.value))}
              className="input-premium"
              min="0"
            />
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-[#030303] rounded-2xl p-6 border border-[#DDA73C]/10 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Amount at Risk</p>
              <p className="font-heading text-3xl font-bold text-[#FF4D4F]">
                ${riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="gold-divider opacity-30" />

            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Position Size (Lots)</p>
              <motion.p 
                key={positionSizeLots}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-heading text-5xl font-black gradient-text"
              >
                {positionSizeLots.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
              <p className="text-white/30 text-sm mt-2 font-mono">
                = {positionSizeUnits.toLocaleString(undefined, { maximumFractionDigits: 0 })} Units
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-white/30 text-xs">
          *Results are estimates based on standard 100,000 unit lots. Exact pip values may vary slightly by broker.
        </p>
      </div>
    </Card>
  )
}
