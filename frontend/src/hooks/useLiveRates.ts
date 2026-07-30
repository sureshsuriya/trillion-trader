import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/axios'

interface TickerItem {
  symbol: string
  label: string
  value: number
  change?: number
}

/**
 * Returns a lookup map of live prices keyed by symbol (e.g. 'EUR/USD': 1.0851).
 * Falls back to sensible defaults when the API is unavailable so calculators remain usable.
 */
export function useLiveRates(): Record<string, number> {
  const DEFAULTS: Record<string, number> = {
    'EUR/USD': 1.08,
    'GBP/USD': 1.27,
    'USD/JPY': 150,
    'AUD/USD': 0.66,
    'XAU/USD': 2400,
    'XAG/USD': 28,
    'BTC/USD': 65000,
    'ETH/USD': 3500,
  }

  const { data } = useQuery<TickerItem[]>({
    queryKey: ['live-ticker'],
    queryFn: () => apiClient.get('/market/ticker').then(res => res.data.data),
    refetchInterval: 60000,
    staleTime: 30000,
  })

  if (!data) return DEFAULTS

  const map: Record<string, number> = { ...DEFAULTS }
  for (const item of data) {
    if (item.symbol && item.value > 0) {
      map[item.symbol] = item.value
    }
  }
  return map
}
