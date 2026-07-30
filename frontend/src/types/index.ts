// ============================================
// GLOBAL TYPE DEFINITIONS
// ============================================

// Navigation
export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

// Stats
export interface Stat {
  label: string
  value: string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
}

// Ticker
export interface TickerSymbol {
  symbol: string
  label: string
  value: number
  change?: number
  changePercent?: number
  direction?: 'up' | 'down'
}

// Cards
export interface ServiceCard {
  id: string
  icon: string
  title: string
  description: string
  features?: string[]
  href?: string
}

// Blog
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  readingTime: number
}

// Testimonial
export interface Testimonial {
  id: string
  name: string
  role: string
  avatar?: string
  content: string
  rating: number
  country?: string
}

// FAQ
export interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

// Broker / Prop Firm
export interface BrokerCard {
  id: string
  name: string
  logo?: string
  description: string
  type: 'ECN' | 'STP' | 'Market Maker' | 'DMA'
  minDeposit: number
  spread: string
  leverage: string
  platforms: string[]
  pros: string[]
  cons: string[]
  rating: number
  referralLink?: string
  referralCode?: string
  featured?: boolean
}

export interface PropFirmCard {
  id: string
  name: string
  logo?: string
  description: string
  challengeFee: number
  maxFunding: number
  profitSplit: string
  drawdownLimit: string
  features: string[]
  rating: number
  referralLink?: string
  referralCode?: string
  featured?: boolean
}

// Resource
export interface Resource {
  id: string
  title: string
  description: string
  type: 'PDF' | 'Video' | 'Article' | 'Course'
  thumbnail?: string
  downloadUrl?: string
  free: boolean
  tags?: string[]
}

// Calculator
export interface CalculatorResult {
  label: string
  value: string | number
  unit?: string
  highlight?: boolean
}

// Contact Form
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
