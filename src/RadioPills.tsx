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
                'peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2',
                'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
                isSelected
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-primary-400'
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
