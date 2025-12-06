'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from './utils'

export interface DatePickerProps {
  value?: Date
  onChange: (date: Date) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  disabled,
  minDate,
  maxDate,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value || new Date())
  const datePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateSelect = (date: Date) => {
    onChange(date)
    setIsOpen(false)
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return isSameDay(date, today)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div ref={datePickerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 rounded-md border transition-all duration-200',
          'bg-background text-left flex items-center justify-between gap-2',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'disabled:bg-secondary disabled:cursor-not-allowed',
          'touch-target',
          error && 'border-error',
          !error && 'border-border',
          isOpen && 'ring-2 ring-primary'
        )}
      >
        <span className={cn('truncate', !value && 'text-primary/50')}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-80 mt-2 bg-background rounded-md border border-border shadow-lg p-4"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>
              
              <div className="font-semibold text-foreground">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-primary/70 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const isSelected = isSameDay(day, value || null)
                const isCurrentDay = isToday(day)
                const isDisabled = isDateDisabled(day)

                return (
                  <motion.button
                    key={day.toISOString()}
                    type="button"
                    whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={cn(
                      'aspect-square rounded-lg flex items-center justify-center',
                      'text-sm font-medium transition-all duration-200',
                      'hover:bg-secondary',
                      isSelected && 'bg-primary text-white hover:bg-primary-dark',
                      isCurrentDay && !isSelected && 'border-2 border-primary text-primary',
                      isDisabled && 'text-border-dark cursor-not-allowed hover:bg-transparent',
                      !isSelected && !isCurrentDay && !isDisabled && 'text-foreground'
                    )}
                  >
                    {day.getDate()}
                  </motion.button>
                )
              })}
            </div>

            {/* Today Button */}
            <div className="mt-4 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="w-full py-2 text-sm font-medium text-primary hover:bg-secondary rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
