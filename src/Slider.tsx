'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  unit?: string
  disabled?: boolean
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  unit = '%',
  disabled,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-primary">{label}</label>}
          {showValue && (
            <span className="text-sm font-semibold text-primary">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      
      <div className="relative h-12 flex items-center">
        <div className="relative w-full h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ zIndex: 10 }}
        />
        
        <motion.div
          className={cn(
            'absolute w-6 h-6 bg-background  border-2 border-primary rounded-full shadow-md',
            'pointer-events-none',
            disabled && 'opacity-50'
          )}
          style={{ left: `calc(${percentage}% - 12px)` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
    </div>
  )
}
