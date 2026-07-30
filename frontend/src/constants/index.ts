// ============================================
// APP CONSTANTS
// ============================================

export const APP_NAME = 'Trillion Traders 369'
export const APP_TAGLINE = 'Trade with Precision. Grow with Purpose.'
export const APP_DESCRIPTION =
  'Trillion Traders 369 is a premier international trading academy providing world-class forex education, live market analysis, and vetted trading tools.'

// ============================================
// SOCIAL LINKS
// ============================================
export const SOCIAL = {
  TELEGRAM: 'https://t.me/trilliontrader369',
  INSTAGRAM: 'https://www.instagram.com/trilliontrader369?igsh=MXQyMmo4ODhyangzaA%3D%3D',
  YOUTUBE: '#',
  TWITTER: '#',
} as const

// ============================================
// NAVIGATION LINKS
// ============================================
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Trading Tools', href: '/tools' },
  { label: 'Prop Firms', href: '/prop-firms' },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Resources', href: '/resources' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const

// ============================================
// API CONFIG
// ============================================
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

// ============================================
// HERO STATS
// ============================================
export const HERO_STATS = [
  { label: 'Active Traders', value: '2,500+', prefix: '' },
  { label: 'Win Rate', value: '78', prefix: '', suffix: '%' },
  { label: 'Years Experience', value: '7+', prefix: '' },
  { label: 'Countries', value: '25+', prefix: '' },
] as const

// ============================================
// TICKER SYMBOLS (Default Values)
// ============================================
export const TICKER_SYMBOLS = [
  { symbol: 'XAU/USD', label: 'Gold', value: 2412.30 },
  { symbol: 'XAG/USD', label: 'Silver', value: 28.44 },
  { symbol: 'BTC/USD', label: 'Bitcoin', value: 64120 },
  { symbol: 'ETH/USD', label: 'Ethereum', value: 3450 },
  { symbol: 'EUR/USD', label: 'Euro', value: 1.0851 },
  { symbol: 'GBP/USD', label: 'Pound', value: 1.2734 },
  { symbol: 'USD/JPY', label: 'Yen', value: 156.22 },
  { symbol: 'AUD/USD', label: 'Aussie', value: 0.6612 },
] as const

// ============================================
// COLORS (Design Tokens)
// ============================================
export const COLORS = {
  GOLD: '#FFD700',
  ACCENT: '#00E676',
  BG: '#050505',
  SURFACE: '#111111',
  ERROR: '#FF4D4F',
} as const
