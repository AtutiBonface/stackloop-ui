'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface ButtonGroupOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface ButtonGroupProps {
  options: ButtonGroupOption[]
  value?: string
  onChange?: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  animate?: boolean
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  disabled = false,
  className,
  animate = true
}) => {
  const shouldAnimate = animate !== false

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-9',
    md: 'px-4 py-2.5 text-sm sm:text-base min-h-11',
    lg: 'px-5 py-3 text-base min-h-12'
  }

  return (
    <div
      role="group"
      aria-disabled={disabled}
      className={cn(
        'inline-flex overflow-hidden rounded-md border border-border bg-background shadow-sm',
        disabled && 'opacity-60',
        className
      )}
    >
      {options.map((option, index) => {
        const isSelected = value === option.value
        const isDisabled = disabled || option.disabled

        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={shouldAnimate ? { scale: isDisabled ? 1 : 0.98 } : undefined}
            onClick={() => {
              if (!isDisabled) {
                onChange?.(option.value)
              }
            }}
            aria-pressed={isSelected}
            disabled={isDisabled}
            className={cn(
              'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
              sizes[size],
              index !== options.length - 1 && 'border-r border-border',
              isSelected
                ? 'bg-primary text-white'
                : 'bg-transparent text-foreground hover:bg-secondary',
              isDisabled && 'cursor-not-allowed'
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
