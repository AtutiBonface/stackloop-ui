'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  className?: string
  onClick?: () => void
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  onClick,
  hover = false
}) => {
  const variants = {
    default: 'bg-background border border-border',
    outlined: 'bg-transparent border-2 border-border-dark',
    elevated: 'bg-background border-2 border-border shadow-card'
  }

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }

  const Component = onClick ? motion.button : motion.div

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover || onClick ? { y: -2, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        'rounded-lg transition-all duration-200',
        variants[variant],
        paddings[padding],
        onClick && 'cursor-pointer w-full text-left',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}
 
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
)

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-foreground', className)}>{children}</h3>
)

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={cn('text-sm text-foreground/70 mt-1', className)}>{children}</p>
)

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className}>{children}</div>
)

