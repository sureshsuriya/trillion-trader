import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../../components/ui/Card'
import { TICKER_SYMBOLS } from '../../../constants/index'

export function MarginCalculator() {
  const [tradeSizeLots, setTradeSizeLots] = useState<number>(1)
  const [leverage, setLeverage] = useState<number>(100)
  const [pair, setPair] = useState<string>('EUR/USD')

  // Results
  const [marginRequired, setMarginRequired] = useState<number>(0)

  useEffect(() => {
    // 1 Lot = 100,000 units of the base currency
    const units = tradeSizeLots * 100000
    
    // Divide by leverage
    const marginInBaseCurrency = units / leverage
    
    // Convert base currency to account currency (USD)
    let marginInUsd = marginInBaseCurrency
    
    if (pair.startsWith('EUR/')) {
      const rate = TICKER_SYMBOLS.find(t => t.symbol === 'EUR/USD')?.value || 1.08
      marginInUsd = marginInBaseCurrency * rate
    } else if (pair.startsWith('GBP/')) {
      const rate = TICKER_SYMBOLS.find(t => t.symbol === 'GBP/USD')?.value || 1.27
      marginInUsd = marginInBaseCurrency * rate
    } else if (pair.startsWith('AUD/')) {
      const rate = TICKER_SYMBOLS.find(t => t.symbol === 'AUD/USD')?.value || 0.66
      marginInUsd = marginInBaseCurrency * rate
    } else if (pair.startsWith('NZD/')) {
      marginInUsd = marginInBaseCurrency * 0.60
    }
    // If it starts with USD (e.g. USD/JPY, USD/CAD), marginInUsd = marginInBaseCurrency, no conversion needed

    setMarginRequired(marginInUsd)
  }, [tradeSizeLots, leverage, pair])

  return (
    <Card glow className="p-6 md:p-8 max-w-2xl mx-auto border-t-2 border-t-[#F472B6]">
      <div className="mb-6 border-b border-[#F472B6]/20 pb-4">
        <h3 className="font-heading text-2xl font-bold text-white mb-2">Margin Calculator</h3>
        <p className="text-white/50 text-sm">Calculate exactly how much margin is required to open a position.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Currency Pair</label>
            <select 
              value={pair} 
              onChange={(e) => setPair(e.target.value)}
              className="input-premium appearance-none bg-[#0A0A0A] focus:border-[#F472B6] focus:shadow-[0_0_0_3px_rgba(244,114,182,0.1)]"
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
              className="input-premium focus:border-[#F472B6] focus:shadow-[0_0_0_3px_rgba(244,114,182,0.1)]"
              min="0.01" step="0.01"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1">Leverage (1:X)</label>
            <select 
              value={leverage} 
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="input-premium appearance-none bg-[#0A0A0A] focus:border-[#F472B6] focus:shadow-[0_0_0_3px_rgba(244,114,182,0.1)]"
            >
              <option value="10">1:10</option>
              <option value="30">1:30</option>
              <option value="50">1:50</option>
              <option value="100">1:100</option>
              <option value="200">1:200</option>
              <option value="500">1:500</option>
              <option value="1000">1:1000</option>
            </select>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-[#030303] rounded-2xl p-6 border border-[#F472B6]/10 flex flex-col justify-center items-center text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Required Margin (USD)</p>
          <motion.p 
            key={marginRequired}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-heading text-5xl font-black text-[#F472B6]"
          >
            ${marginRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.p>
        </div>
      </div>
    </Card>
  )
}
