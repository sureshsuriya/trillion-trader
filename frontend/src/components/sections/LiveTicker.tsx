import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../api/axios'

interface TickerItem {
  symbol: string
  label: string
  value: number
  change?: number
}

export function LiveTicker() {
  const tickerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useQuery<TickerItem[]>({
    queryKey: ['live-ticker'],
    queryFn: () => apiClient.get('/market/ticker').then(res => res.data.data),
    refetchInterval: 60000,
  })

  // Duplicate items for seamless loop animation
  const items: TickerItem[] = data ? [...data, ...data, ...data] : []

  return (
    <div className="w-full overflow-hidden bg-surface/60 border-y border-white/5 py-2.5 relative">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-bg to-transparent pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-bg to-transparent pointer-events-none" />

      <div ref={tickerRef} className="flex items-center animate-ticker whitespace-nowrap gap-8 px-4">
        {isLoading ? (
          <div className="flex items-center gap-8 px-4 opacity-50">
             <span className="text-white/40 text-xs font-medium">Fetching Live Markets...</span>
          </div>
        ) : items.length > 0 ? (
          items.map((item, i) => (
            <TickerItem key={`${item.symbol}-${i}`} item={item} />
          ))
        ) : (
          <div className="flex items-center gap-8 px-4 opacity-50">
             <span className="text-white/40 text-xs font-medium">Market Data Unavailable</span>
          </div>
        )}
      </div>
    </div>
  )
}

function TickerItem({ item }: { item: TickerItem }) {
  const isUp = (item.change ?? 0) >= 0
  const decimals = item.value >= 100 ? 2 : 4
  const formatted = item.value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <div className="flex items-center gap-2.5 flex-shrink-0">
      <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
      <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{item.symbol}</span>
      <span className="font-mono text-xs font-semibold text-white">{formatted}</span>
      {item.change !== null && item.change !== undefined && (
        <span className={`font-mono text-xs font-medium ${isUp ? 'text-accent' : 'text-error'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
        </span>
      )}
    </div>
  )
}
