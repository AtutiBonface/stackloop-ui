import React from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface RadioPillsProps {
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>
  value?: string
  onChange?: (value: string) => void
  name: string
  disabled?: boolean
  className?: string
}

export const RadioPills: React.FC<RadioPillsProps> = ({
  options,
  value,
  onChange,
  name,
  disabled,
  className
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = value === option.value
        
        return (
          <label key={option.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className="sr-only peer"
            />
            
            <motion.div
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              className={cn(
                'px-4 py-2.5 rounded-full border-2 transition-all duration-200',
                'flex items-center gap-2 min-h-[2.75rem]',
                'peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2',
                'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
                isSelected
                  ? 'bg-primary border-primary text-white'
                  : 'bg-background border-border text-primary hover:border-border-dark'
              )}
            >
              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
              <span className="font-medium text-base">{option.label}</span>
            </motion.div>
          </label>
        )
      })}
    </div>
  )
}
