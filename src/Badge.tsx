'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false
}) => {
  const variantClasses = {
    default: 'bg-secondary text-primary border border-border',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-error/10 text-error border border-error/20',
    info: 'bg-info/10 text-info border border-info/20'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const dotColors = {
    default: 'bg-primary',
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-error',
    info: 'bg-info'
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </motion.span>
  )
}
