import { motion } from 'framer-motion'

// ============================================
// POLYMORPHIC BUTTON — supports as={Link}, as="a", etc.
// ============================================
type ButtonVariant = 'gold' | 'ghost' | 'outline' | 'accent' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  className?: string
  children?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  gold: '',     // handled via inline style in render
  ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
  outline: 'bg-transparent border text-[#FFB800] hover:bg-[#FFB800]/5',
  accent: 'bg-transparent border border-[#00D084]/30 text-[#00D084] hover:bg-[#00D084]/10',
  danger: 'bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-xl gap-1.5',
  md: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-2xl gap-2',
  xl: 'px-10 py-4 text-lg rounded-2xl gap-3',
}

// The core shared class builder
function buildClassName(variant: ButtonVariant, size: ButtonSize, fullWidth: boolean, extra: string) {
  return [
    'relative inline-flex items-center justify-center font-medium',
    'transition-all duration-300 cursor-pointer select-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    extra,
  ].join(' ')
}

// ============================================
// LINK BUTTON (for React Router Link or <a>)
// ============================================
interface LinkButtonProps extends ButtonBaseProps {
  href: string
  to?: never
  target?: string
  rel?: string
}

interface RouterButtonProps extends ButtonBaseProps {
  to: string
  href?: never
  onClick?: () => void
}

interface StandardButtonProps extends ButtonBaseProps {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  href?: never
  to?: never
}

export type ButtonProps = LinkButtonProps | RouterButtonProps | StandardButtonProps

export function Button({
  variant = 'gold',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const cls = buildClassName(variant, size, fullWidth, className)

  // Gold variant uses inline styles to ensure correct color token resolution
  const goldStyle = variant === 'gold' ? {
    background: 'linear-gradient(135deg, #F5D36B 0%, #DDA73C 45%, #996D19 100%)',
    color: '#030303',
    fontWeight: 700,
    boxShadow: '0 0 14px rgba(221,167,60,0.25)',
    border: 'none',
  } : {}

  const inner = isLoading ? (
    <span className="flex items-center gap-2">
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      Loading...
    </span>
  ) : (
    <>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </>
  )

  // External link
  if ('href' in rest && rest.href) {
    const { href, target, rel, ...anchorRest } = rest as LinkButtonProps
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className={cls}
        style={goldStyle}
        {...(anchorRest as any)}
      >
        {inner}
      </motion.a>
    )
  }

  // Regular button
  const { onClick, type = 'button', disabled, ...btnRest } = rest as StandardButtonProps
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={cls}
      style={goldStyle}
      {...(btnRest as any)}
    >
      {inner}
    </motion.button>
  )
}
