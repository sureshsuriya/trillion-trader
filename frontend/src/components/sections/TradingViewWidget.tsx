import { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  containerId?: string
  symbol?: string
  theme?: 'dark' | 'light'
  height?: number
}

export function TradingViewWidget({
  containerId = 'tv-widget',
  symbol = 'FX:EURUSD',
  theme = 'dark',
  height = 500,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up any previous script
    if (scriptRef.current) {
      scriptRef.current.remove()
      scriptRef.current = null
    }

    const widgetEl = containerRef.current.querySelector('.tradingview-widget-container__widget')
    if (widgetEl) widgetEl.innerHTML = ''

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: '60',
      timezone: 'Asia/Kolkata',
      theme,
      style: '1',
      locale: 'en',
      backgroundColor: '#111111',
      gridColor: 'rgba(255,215,0,0.05)',
      container_id: containerId,
    })

    containerRef.current.appendChild(script)
    scriptRef.current = script

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove()
        scriptRef.current = null
      }
    }
  }, [containerId, symbol, theme])

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container"
      id={containerId}
      style={{ height: `${height}px`, width: '100%' }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
    </div>
  )
}
