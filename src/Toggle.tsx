'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  description?: string
  onChange?: (checked: boolean) => void
  animate?: boolean
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className, checked, onChange, animate = true, ...props }, ref) => {
    const shouldAnimate = animate !== false
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked)
    }
  
    return (
      <label className="flex items-center justify-between gap-4 cursor-pointer group">
        {(label || description) && (
          <div className="flex-1 space-y-0.5">
            {label && (
              <div className="text-base font-medium text-foreground">
                {label}
              </div>
            )}
            {description && (
              <div className="text-sm text-primary/70">{description}</div>
            )}
          </div>
        )}
        
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            onChange={handleChange}
            className="sr-only peer"
            checked={checked}
            {...props}
          />
          <div
            className={cn(
              'w-12 h-7 rounded-full transition-all duration-200 relative',
              'peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              checked ? 'bg-primary' : 'bg-border-dark',
              className
            )}
          >
            <motion.div
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
              style={{ left: checked ? '24px' : '4px' }}
              animate={shouldAnimate ? { left: checked ? '24px' : '4px' } : undefined}
              transition={shouldAnimate ? { type: 'spring', stiffness: 500, damping: 30 } : { duration: 0 }}
            />
          </div>
        </div>
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'
