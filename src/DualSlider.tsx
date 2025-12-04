import React from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface DualSliderProps {
  value1: number
  value2: number
  onChange: (value1: number, value2: number) => void
  label1: string
  label2: string
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled?: boolean
  className?: string
}

export const DualSlider: React.FC<DualSliderProps> = ({
  value1,
  value2,
  onChange,
  label1,
  label2,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  disabled,
  className
}) => {
  const total = value1 + value2
  const percentage1 = total > 0 ? (value1 / total) * 100 : 50
  const percentage2 = total > 0 ? (value2 / total) * 100 : 50

  const handleSliderChange = (newValue1: number) => {
    const remaining = max - newValue1
    onChange(newValue1, Math.max(min, Math.min(max, remaining)))
  }

  return (
    <div className={cn('w-full space-y-3', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700">{label1}</label>
          <span className="text-sm font-semibold text-primary-700">
            {value1}{unit}
          </span>
        </div>
        
        <div className="relative h-10 flex items-center">
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600"
              initial={false}
              animate={{ width: `${percentage1}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value1}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            disabled={disabled}
            className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700">{label2}</label>
          <span className="text-sm font-semibold text-success">
            {value2}{unit}
          </span>
        </div>
        
        <div className="relative h-10 flex items-center">
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-success"
              initial={false}
              animate={{ width: `${percentage2}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value2}
            onChange={(e) => handleSliderChange(max - Number(e.target.value))}
            disabled={disabled}
            className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="text-xs text-neutral-500 text-center">
        Total: {total}{unit}
      </div>
    </div>
  )
}
