'use client'

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react' 
import { cn } from './utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  animate?: boolean
}

type MotionButtonProps = Omit<ButtonProps, 'children' | keyof HTMLMotionProps<'button'>> & { children?: React.ReactNode } & HTMLMotionProps<'button'>

export const Button = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, animate = true, className, children, disabled, ...props }, ref) => {
    const shouldAnimate = animate !== false
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 touch-target disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex-shrink-0 whitespace-nowrap'
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark/90 shadow-sm',
      secondary: 'bg-secondary text-foreground hover:bg-border active:bg-border-dark',
      outline: 'bg-transparent text-primary border-2 border-primary hover:bg-secondary active:bg-border',
      ghost: 'bg-transparent text-primary hover:bg-secondary active:bg-border',
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
        whileTap={shouldAnimate ? { scale: disabled || loading ? 1 : 0.98 } : undefined}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn('h-5 w-5', shouldAnimate && 'animate-spin')} />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

