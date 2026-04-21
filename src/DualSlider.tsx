'use client'

import React, { useState } from 'react'
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
  animate?: boolean
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
  className,
  animate = true
}) => {
  const shouldAnimate = animate !== false
  const [isDraggingFirst, setIsDraggingFirst] = useState(false)
  const [isDraggingSecond, setIsDraggingSecond] = useState(false)
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
          <label className="text-sm font-medium text-primary">{label1}</label>
          <span className="text-sm font-semibold text-primary">
            {value1}{unit}
          </span>
        </div>
        
        <div className="relative h-12 flex items-center">
          <div className="relative w-full h-2 bg-border rounded-none overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary rounded-none"
              initial={false}
              animate={shouldAnimate ? { width: `${percentage1}%` } : undefined}
              transition={shouldAnimate ? { type: 'spring', stiffness: 300, damping: 30 } : { duration: 0 }}
            />
          </div>
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value1}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            onMouseDown={() => setIsDraggingFirst(true)}
            onMouseUp={() => setIsDraggingFirst(false)}
            onTouchStart={() => setIsDraggingFirst(true)}
            onTouchEnd={() => setIsDraggingFirst(false)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            style={{ zIndex: 10 }}
          />

          <motion.div
            className={cn(
              'absolute w-5 h-5 bg-background border-2 border-primary rounded-full shadow-md',
              'pointer-events-none',
              disabled && 'opacity-50'
            )}
            style={{ left: `calc(${percentage1}% - 10px)` }}
            animate={shouldAnimate ? { scale: isDraggingFirst ? 1.15 : 1 } : undefined}
            transition={shouldAnimate ? { type: 'spring', stiffness: 300, damping: 20 } : { duration: 0 }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-primary">{label2}</label>
          <span className="text-sm font-semibold text-success">
            {value2}{unit}
          </span>
        </div>
        
        <div className="relative h-12 flex items-center">
          <div className="relative w-full h-2 bg-border rounded-none overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-success rounded-none"
              initial={false}
              animate={shouldAnimate ? { width: `${percentage2}%` } : undefined}
              transition={shouldAnimate ? { type: 'spring', stiffness: 300, damping: 30 } : { duration: 0 }}
            />
          </div>
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value2}
            onChange={(e) => handleSliderChange(max - Number(e.target.value))}
            onMouseDown={() => setIsDraggingSecond(true)}
            onMouseUp={() => setIsDraggingSecond(false)}
            onTouchStart={() => setIsDraggingSecond(true)}
            onTouchEnd={() => setIsDraggingSecond(false)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            style={{ zIndex: 10 }}
          />

          <motion.div
            className={cn(
              'absolute w-5 h-5 bg-background border-2 border-success rounded-full shadow-md',
              'pointer-events-none',
              disabled && 'opacity-50'
            )}
            style={{ left: `calc(${percentage2}% - 10px)` }}
            animate={shouldAnimate ? { scale: isDraggingSecond ? 1.15 : 1 } : undefined}
            transition={shouldAnimate ? { type: 'spring', stiffness: 300, damping: 20 } : { duration: 0 }}
          />
        </div>
      </div>

      <div className="text-xs text-primary/70 text-center">
        Total: {total}{unit}
      </div>
    </div>
  )
}
