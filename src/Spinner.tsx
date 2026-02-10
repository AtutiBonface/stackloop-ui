'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white'
  className?: string
  label?: string
  animate?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4'
}

const variantClasses = {
  primary: 'border-primary border-t-transparent',
  secondary: 'border-secondary border-t-transparent',
  white: 'border-white border-t-transparent'
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  label,
  animate = true
}) => {
  const shouldAnimate = animate !== false
  const SpinnerElement = shouldAnimate ? motion.div : 'div'
  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <SpinnerElement
        className={cn(
          'rounded-full',
          sizeClasses[size],
          variantClasses[variant]
        )}
        {...(shouldAnimate
          ? { animate: { rotate: 360 }, transition: { duration: 0.8, repeat: Infinity, ease: 'linear' } }
          : {})}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && (
        <span className="text-sm text-foreground/70">{label}</span>
      )}
    </div>
  )
}

Spinner.displayName = 'Spinner'
