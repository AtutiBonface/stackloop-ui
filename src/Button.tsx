import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react' 
import { cn } from './utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

type MotionButtonProps = Omit<ButtonProps, 'children' | keyof HTMLMotionProps<'button'>> & { children?: React.ReactNode } & HTMLMotionProps<'button'>

export const Button = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, className, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 touch-target disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
      secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400',
      outline: 'bg-transparent text-primary-700 border-2 border-primary-600 hover:bg-primary-50 active:bg-primary-100',
      ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
      danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-sm'
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-[2.25rem]',
      md: 'px-4 py-2.5 text-base min-h-[2.75rem]',
      lg: 'px-6 py-3.5 text-lg min-h-[3.25rem]'
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

