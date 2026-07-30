import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../api/axios'
import { staggerContainer, staggerItem, sectionHeaderVariants } from '../../animations/variants'

// ============================================
// SYMBOL TABS
// ============================================
const SYMBOLS = [
  { label: 'XAU/USD', display: 'Gold',    symbol: 'TVC:GOLD',          color: '#FFD700' },
  { label: 'EUR/USD', display: 'Euro',    symbol: 'FX:EURUSD',         color: '#60A5FA' },
  { label: 'GBP/USD', display: 'Pound',   symbol: 'FX:GBPUSD',         color: '#34D399' },
  { label: 'BTC/USD', display: 'Bitcoin', symbol: 'BINANCE:BTCUSDT',   color: '#F97316' },
  { label: 'USD/JPY', display: 'Yen',     symbol: 'FX:USDJPY',         color: '#A78BFA' },
  { label: 'NAS100',  display: 'Nasdaq',  symbol: 'CAPITALCOM:US100',  color: '#F472B6' },
]

interface MarketOverview {
  session: string
  volatility: string
  riskMood: string
  dxyValue: string
  vixValue: string
}

// ============================================
// TRADINGVIEW EMBED — debounced init
// ============================================
function TradingViewEmbed({ symbol, widgetId }: { symbol: string; widgetId: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)

    const timer = setTimeout(() => {
      if (!ref.current) return

      if (scriptRef.current) { scriptRef.current.remove(); scriptRef.current = null }

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol,
        interval: '60',
        timezone: 'Asia/Kolkata',
        theme: 'dark',
        style: '1',
        locale: 'en',
        backgroundColor: '#0A0A0A',
        gridColor: 'rgba(255,215,0,0.04)',
        toolbar_bg: '#0D0D0D',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: widgetId,
        studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
      })
      script.onload = () => setLoaded(true)
      ref.current.appendChild(script)
      scriptRef.current = script

      setTimeout(() => setLoaded(true), 3000)
    }, 200)

    return () => {
      clearTimeout(timer)
      if (scriptRef.current) { scriptRef.current.remove(); scriptRef.current = null }
    }
  }, [symbol, widgetId])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: '#0A0A0A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '12px',
            }}
          >
            <div style={{
              width: '40px', height: '40px',
              border: '2px solid #FFD700',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ color: 'rgba(255,215,0,0.5)', fontSize: '0.8rem', fontFamily: 'Space Grotesk, monospace', letterSpacing: '0.1em' }}>
              Loading Chart…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={ref}
        id={widgetId}
        className="tradingview-widget-container"
        style={{ width: '100%', height: '100%' }}
      >
        <div className="tradingview-widget-container__widget" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

// ============================================
// MARKET STAT PILL
// ============================================
function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 16px', borderRadius: '999px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}25`,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ color, fontFamily: 'Space Grotesk, monospace', fontSize: '0.8rem', fontWeight: 700 }}>{value}</span>
    </div>
  )
}

// ============================================
// MAIN SECTION
// ============================================
export function MarketOverviewSection() {
  const [active, setActive] = useState(SYMBOLS[0])

  const widgetId = `tv-${active.label.replace('/', '-').toLowerCase()}`

  const { data: overview } = useQuery<MarketOverview>({
    queryKey: ['market-overview'],
    queryFn: () => apiClient.get('/market/overview').then(res => res.data.data),
    refetchInterval: 60000,
  })

  return (
    <section style={{ padding: '6rem 0 7rem', position: 'relative', overflow: 'hidden' }}>

      {/* Top ambient glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '900px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(221,167,60,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(221,167,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(221,167,60,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* SECTION HEADER */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <span className="badge">Live Markets</span>
          </div>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 900, lineHeight: 1.15, color: 'white', marginBottom: '1rem',
          }}>
            Real-Time Market{' '}
            <span style={{
              background: 'linear-gradient(135deg, #F5D36B 0%, #DDA73C 45%, #996D19 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Overview
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Pro-grade charts with RSI & MACD indicators. Switch instruments and timeframes instantly.
          </p>
        </motion.div>

        {/* SYMBOL TABS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
            justifyContent: 'center', marginBottom: '1.5rem',
          }}
        >
          {SYMBOLS.map((sym) => {
            const isActive = sym.label === active.label
            return (
              <motion.button
                key={sym.label}
                variants={staggerItem}
                onClick={() => setActive(sym)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '9px 22px',
                  borderRadius: '999px',
                  border: isActive ? `1.5px solid ${sym.color}` : '1px solid rgba(255,255,255,0.07)',
                  background: isActive ? `${sym.color}15` : 'rgba(255,255,255,0.02)',
                  color: isActive ? sym.color : 'rgba(255,255,255,0.45)',
                  fontFamily: 'Space Grotesk, monospace',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? `0 0 16px ${sym.color}28` : 'none',
                  letterSpacing: '0.02em',
                }}
              >
                {sym.label}
                <span style={{ marginLeft: '6px', opacity: 0.55, fontWeight: 400, fontSize: '0.72rem' }}>
                  {sym.display}
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* CHART CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: '1.75rem',
            overflow: 'hidden',
            border: '1px solid rgba(221,167,60,0.14)',
            background: '#0A0A0A',
            boxShadow: '0 0 80px rgba(221,167,60,0.07), 0 30px 100px rgba(0,0,0,0.8)',
          }}
        >
          {/* --- CHART HEADER --- */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(221,167,60,0.05) 0%, rgba(0,0,0,0) 100%)',
            borderBottom: '1px solid rgba(221,167,60,0.09)',
            flexWrap: 'wrap', gap: '0.75rem',
          }}>
            {/* Left: live badge + symbol */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  backgroundColor: '#00E676',
                  boxShadow: '0 0 6px #00E676',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }} />
                <span style={{ color: '#00E676', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Space Grotesk, monospace' }}>
                  Live
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1rem' }}>|</span>
              <span style={{
                fontFamily: 'Space Grotesk, monospace', fontWeight: 800,
                color: active.color, fontSize: '1.2rem', letterSpacing: '-0.01em',
              }}>
                {active.label}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 400 }}>
                {active.display} · 1H
              </span>
            </div>
          </div>

          {/* --- CHART BODY --- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ height: '700px', width: '100%', background: '#0A0A0A' }}
            >
              <TradingViewEmbed symbol={active.symbol} widgetId={widgetId} />
            </motion.div>
          </AnimatePresence>

          {/* --- CHART FOOTER --- */}
          <div style={{
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid rgba(255,215,0,0.07)',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.7rem' }}>
              Chart data provided by TradingView (live) · Market stats updated every 60 seconds
            </span>
            <a
              href="https://www.tradingview.com"
              target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(255,215,0,0.45)', fontSize: '0.7rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Open full chart →
            </a>
          </div>
        </motion.div>

        {/* BOTTOM LIVE MARKET CONTEXT PILLS — sourced from backend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '1.75rem' }}
        >
          <StatPill label="Session"    value={overview?.session    ?? '…'} color="#FFD700" />
          <StatPill label="Volatility" value={overview?.volatility ?? '…'} color="#F97316" />
          <StatPill label="Fear & Greed" value={overview?.riskMood   ?? '…'} color="#00E676" />
          <StatPill label="DXY"        value={overview?.dxyValue   ?? '…'} color="#F472B6" />
          <StatPill label="VIX"        value={overview?.vixValue   ?? '…'} color="#A78BFA" />
        </motion.div>

      </div>
    </section>
  )
}
