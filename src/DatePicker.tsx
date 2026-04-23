'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from './utils'
import { FloatingPortal } from './FloatingPortal'

export interface DatePickerProps {
  value?: Date
  onChange: (date: Date) => void
  label?: string
  required?: boolean
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  animate?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  required,
  placeholder = 'Select date',
  error,
  hint,
  disabled,
  minDate,
  maxDate,
  className,
  animate = true
}) => {
  const shouldAnimate = animate !== false
  const [isOpen, setIsOpen] = useState(false)
  const [pickerPosition, setPickerPosition] = useState<'bottom' | 'top'>('bottom')
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false)
  const [monthMenuPosition, setMonthMenuPosition] = useState<'bottom' | 'top'>('bottom')
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false)
  const [yearMenuPosition, setYearMenuPosition] = useState<'bottom' | 'top'>('bottom')
  const [currentMonth, setCurrentMonth] = useState(value || new Date())
  const datePickerRef = useRef<HTMLDivElement>(null)
  const pickerTriggerRef = useRef<HTMLButtonElement>(null)
  const monthMenuTriggerRef = useRef<HTMLButtonElement>(null)
  const monthMenuRef = useRef<HTMLDivElement>(null)
  const yearMenuTriggerRef = useRef<HTMLButtonElement>(null)
  const yearMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsMonthMenuOpen(false)
        setIsYearMenuOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsMonthMenuOpen(false)
      setIsYearMenuOpen(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const updatePlacement = () => {
      if (!pickerTriggerRef.current) return

      const rect = pickerTriggerRef.current.getBoundingClientRect()
      const estimatedMenuHeight = 430
      const availableBottom = window.innerHeight - rect.bottom - 8
      const availableTop = rect.top - 8

      if (availableBottom >= estimatedMenuHeight) {
        setPickerPosition('bottom')
        return
      }

      if (availableTop >= estimatedMenuHeight) {
        setPickerPosition('top')
        return
      }

      setPickerPosition('bottom')
    }

    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)

    return () => {
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isMonthMenuOpen) return
    const selectedMonth = currentMonth.getMonth()
    const selectedMonthElement = monthMenuRef.current?.querySelector<HTMLButtonElement>(`button[data-month="${selectedMonth}"]`)
    selectedMonthElement?.scrollIntoView({ block: 'center' })
  }, [isMonthMenuOpen, currentMonth])

  useEffect(() => {
    if (!isYearMenuOpen) return
    const selectedYear = currentMonth.getFullYear()
    const selectedYearElement = yearMenuRef.current?.querySelector<HTMLButtonElement>(`button[data-year="${selectedYear}"]`)
    selectedYearElement?.scrollIntoView({ block: 'center' })
  }, [isYearMenuOpen, currentMonth])

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
    const startingDayOfWeek = firstDay.getDay()
    const endingDayOfWeek = lastDay.getDay()
    const totalDays = startingDayOfWeek + lastDay.getDate() + (6 - endingDayOfWeek)
    const gridStart = new Date(year, month, 1 - startingDayOfWeek)

    return Array.from({ length: totalDays }, (_, index) => {
      const day = new Date(gridStart)
      day.setDate(gridStart.getDate() + index)
      return day
    })
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleMonthChange = (nextMonth: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), nextMonth, 1))
    setIsMonthMenuOpen(false)
  }

  const handleYearChange = (nextYear: number) => {
    setCurrentMonth(new Date(nextYear, currentMonth.getMonth(), 1))
    setIsYearMenuOpen(false)
  }

  const toggleYearMenu = () => {
    setIsMonthMenuOpen(false)
    if (!isYearMenuOpen && yearMenuTriggerRef.current) {
      const triggerRect = yearMenuTriggerRef.current.getBoundingClientRect()
      const availableBottom = window.innerHeight - triggerRect.bottom
      const availableTop = triggerRect.top
      setYearMenuPosition(availableBottom < 220 && availableTop > availableBottom ? 'top' : 'bottom')
    }
    setIsYearMenuOpen((previous) => !previous)
  }

  const toggleMonthMenu = () => {
    setIsYearMenuOpen(false)
    if (!isMonthMenuOpen && monthMenuTriggerRef.current) {
      const triggerRect = monthMenuTriggerRef.current.getBoundingClientRect()
      const availableBottom = window.innerHeight - triggerRect.bottom
      const availableTop = triggerRect.top
      setMonthMenuPosition(availableBottom < 220 && availableTop > availableBottom ? 'top' : 'bottom')
    }
    setIsMonthMenuOpen((previous) => !previous)
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
  const currentYear = currentMonth.getFullYear()
  const currentMonthIndex = currentMonth.getMonth()

  const startYear = minDate ? minDate.getFullYear() : currentYear - 100
  const endYear = maxDate ? maxDate.getFullYear() : currentYear + 20
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)

  const isMonthOutOfRange = (monthIndex: number) => {
    if (minDate) {
      const minYear = minDate.getFullYear()
      const minMonth = minDate.getMonth()
      if (currentYear === minYear && monthIndex < minMonth) return true
    }

    if (maxDate) {
      const maxYear = maxDate.getFullYear()
      const maxMonth = maxDate.getMonth()
      if (currentYear === maxYear && monthIndex > maxMonth) return true
    }

    return false
  }

  const panelAnimation =
    pickerPosition === 'bottom'
      ? { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }
      : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 } }

  return (
    <div ref={datePickerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <button
        ref={pickerTriggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-required={required}
        className={cn(
          'w-full px-4 py-3 rounded-md border transition-all duration-200',
          'bg-background text-left flex items-center justify-between gap-2 text-foreground',
          'focus:outline-none focus:ring-1 focus:ring-primary',
          'disabled:bg-secondary disabled:text-border-dark disabled:cursor-not-allowed',
          'touch-target',
          error && 'border-error',
          !error && 'border-border',
          isOpen && 'ring-1 ring-primary'
        )}
      >
        <span className={cn('truncate', !value && 'text-foreground/50', disabled && 'text-border-dark')}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className={cn('w-5 h-5 shrink-0', disabled ? 'text-border-dark' : 'text-primary')} />
      </button>

      {shouldAnimate ? (
        <AnimatePresence>
          {isOpen ? (
            <FloatingPortal open={isOpen} anchorRef={pickerTriggerRef} placement={pickerPosition} matchWidth={false}>
              <motion.div
                initial={panelAnimation.initial}
                animate={panelAnimation.animate}
                exit={panelAnimation.exit}
                transition={{ duration: 0.2 }}
                className="z-50 w-72 bg-background rounded-md border border-border shadow-lg p-2.5"
              >
            {/* Month Navigation */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1.5 border-border mb-3">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </button>
              
              <div className="flex items-center justify-center gap-1 min-w-0">
                <div className="relative">
                  <button
                    ref={monthMenuTriggerRef}
                    type="button"
                    onClick={toggleMonthMenu}
                    className="h-7 w-20 shrink-0 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between gap-1"
                    aria-label="Select month"
                    aria-haspopup="listbox"
                    aria-expanded={isMonthMenuOpen}
                  >
                    <span className="min-w-0 flex-1 truncate text-left">{monthNames[currentMonthIndex]}</span>
                    <ChevronDown className={cn('w-3 h-3 text-primary transition-transform', isMonthMenuOpen && 'rotate-180')} />
                  </button>

                  {isMonthMenuOpen && (
                    <div
                      ref={monthMenuRef}
                      role="listbox"
                      className={cn(
                        'absolute z-60 w-36 rounded-md border border-border bg-background shadow-lg py-1 max-h-56 overflow-y-auto',
                        monthMenuPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
                      )}
                    >
                      {monthNames.map((monthName, monthIndex) => {
                        const isDisabled = isMonthOutOfRange(monthIndex)
                        return (
                          <button
                            key={monthName}
                            type="button"
                            role="option"
                            data-month={monthIndex}
                            aria-selected={monthIndex === currentMonthIndex}
                            onClick={() => !isDisabled && handleMonthChange(monthIndex)}
                            disabled={isDisabled}
                            className={cn(
                              'w-full px-3 py-2 text-xs text-left transition-colors',
                              !isDisabled && 'hover:bg-secondary',
                              monthIndex === currentMonthIndex && 'bg-border text-foreground font-medium',
                              isDisabled && 'text-border-dark cursor-not-allowed'
                            )}
                          >
                            {monthName}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    ref={yearMenuTriggerRef}
                    type="button"
                    onClick={toggleYearMenu}
                    className="h-7 w-16 shrink-0 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between gap-1"
                    aria-label="Select year"
                    aria-haspopup="listbox"
                    aria-expanded={isYearMenuOpen}
                  >
                    <span className="min-w-0 flex-1 truncate text-left">{currentYear}</span>
                    <ChevronDown className={cn('w-3 h-3 text-primary transition-transform', isYearMenuOpen && 'rotate-180')} />
                  </button>

                  {isYearMenuOpen && (
                    <div
                      ref={yearMenuRef}
                      role="listbox"
                      className={cn(
                        'absolute z-60 w-28 rounded-md border border-border bg-background shadow-lg py-1 max-h-56 overflow-y-auto',
                        yearMenuPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
                      )}
                    >
                      {yearOptions.map((yearOption) => (
                        <button
                          key={yearOption}
                          type="button"
                          role="option"
                          data-year={yearOption}
                          aria-selected={yearOption === currentYear}
                          onClick={() => handleYearChange(yearOption)}
                          className={cn(
                            'w-full px-3 py-2 text-xs text-left hover:bg-secondary transition-colors',
                            yearOption === currentYear && 'bg-border text-foreground font-medium'
                          )}
                        >
                          {yearOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {dayNames.map(day => (
                <div
                  key={day}
                  className="text-center text-[10px] font-medium text-foreground/70 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0 border border-border rounded-md overflow-hidden">
              {days.map((day, index) => {
                const isLastColumn = (index + 1) % 7 === 0
                const isLastRow = Math.floor(index / 7) === Math.floor((days.length - 1) / 7)

                const isSelected = isSameDay(day, value || null)
                const isCurrentDay = isToday(day)
                const isCurrentMonthDay = day.getMonth() === currentMonthIndex && day.getFullYear() === currentYear
                const isDisabled = !isCurrentMonthDay || isDateDisabled(day)

                return (
                  <motion.button
                    key={day.toISOString()}
                    type="button"
                    whileTap={shouldAnimate ? { scale: isDisabled ? 1 : 0.95 } : undefined}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={cn(
                      'h-8 w-full cursor-pointer rounded-none flex items-center justify-center',
                      'text-[10px] font-medium transition-all duration-200',
                      !isLastColumn && 'border-r border-border',
                      !isLastRow && 'border-b border-border',
                      isCurrentMonthDay && 'hover:bg-secondary',
                      !isCurrentMonthDay && 'bg-secondary/40',
                      isSelected && 'bg-primary text-white hover:bg-primary/80',
                      isCurrentDay && !isSelected && 'border border-primary text-primary',
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
            <div className="mt-1.5">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="w-full py-1.5 text-xs font-medium text-primary cursor-pointer hover:bg-secondary rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
              </motion.div>
            </FloatingPortal>
          ) : null}
        </AnimatePresence>
      ) : (
        isOpen && (
          <FloatingPortal open={isOpen} anchorRef={pickerTriggerRef} placement={pickerPosition} matchWidth={false}>
            <div className="z-50 w-72 bg-background rounded-md border border-border shadow-lg p-2.5">
            {/* Month Navigation */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1.5 mb-3">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </button>
              
              <div className="flex items-center justify-center gap-1 min-w-0">
                <div className="relative">
                  <button
                    ref={monthMenuTriggerRef}
                    type="button"
                    onClick={toggleMonthMenu}
                    className="h-7 w-20 shrink-0 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between gap-1"
                    aria-label="Select month"
                    aria-haspopup="listbox"
                    aria-expanded={isMonthMenuOpen}
                  >
                    <span className="min-w-0 flex-1 truncate text-left">{monthNames[currentMonthIndex]}</span>
                    <ChevronDown className={cn('w-3 h-3 text-primary transition-transform', isMonthMenuOpen && 'rotate-180')} />
                  </button>

                  {isMonthMenuOpen && (
                    <div
                      ref={monthMenuRef}
                      role="listbox"
                      className={cn(
                        'absolute z-60 w-36 rounded-md border border-border bg-background shadow-lg py-1 max-h-56 overflow-y-auto',
                        monthMenuPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
                      )}
                    >
                      {monthNames.map((monthName, monthIndex) => {
                        const isDisabled = isMonthOutOfRange(monthIndex)
                        return (
                          <button
                            key={monthName}
                            type="button"
                            role="option"
                            data-month={monthIndex}
                            aria-selected={monthIndex === currentMonthIndex}
                            onClick={() => !isDisabled && handleMonthChange(monthIndex)}
                            disabled={isDisabled}
                            className={cn(
                              'w-full px-3 py-2 text-xs text-left transition-colors',
                              !isDisabled && 'hover:bg-secondary',
                              monthIndex === currentMonthIndex && 'bg-border text-foreground font-medium',
                              isDisabled && 'text-border-dark cursor-not-allowed'
                            )}
                          >
                            {monthName}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    ref={yearMenuTriggerRef}
                    type="button"
                    onClick={toggleYearMenu}
                    className="h-7 w-14 shrink-0 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between gap-1"
                    aria-label="Select year"
                    aria-haspopup="listbox"
                    aria-expanded={isYearMenuOpen}
                  >
                    <span className="min-w-0 flex-1 truncate text-left">{currentYear}</span>
                    <ChevronDown className={cn('w-3 h-3 text-primary transition-transform', isYearMenuOpen && 'rotate-180')} />
                  </button>

                  {isYearMenuOpen && (
                    <div
                      ref={yearMenuRef}
                      role="listbox"
                      className={cn(
                        'absolute z-60 w-28 rounded-md border border-border bg-background shadow-lg py-1 max-h-56 overflow-y-auto',
                        yearMenuPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
                      )}
                    >
                      {yearOptions.map((yearOption) => (
                        <button
                          key={yearOption}
                          type="button"
                          role="option"
                          data-year={yearOption}
                          aria-selected={yearOption === currentYear}
                          onClick={() => handleYearChange(yearOption)}
                          className={cn(
                            'w-full px-3 py-2 text-xs text-left hover:bg-secondary transition-colors',
                            yearOption === currentYear && 'bg-border text-foreground font-medium'
                          )}
                        >
                          {yearOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {dayNames.map(day => (
                <div
                  key={day}
                  className="text-center text-[10px] font-medium text-primary/70 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0 border border-border rounded-md overflow-hidden">
              {days.map((day, index) => {
                const isLastColumn = (index + 1) % 7 === 0
                const isLastRow = Math.floor(index / 7) === Math.floor((days.length - 1) / 7)

                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className={cn(
                        'h-8 bg-background',
                        !isLastColumn && 'border-r border-border',
                        !isLastRow && 'border-b border-border'
                      )}
                    />
                  )
                }

                const isSelected = isSameDay(day, value || null)
                const isCurrentDay = isToday(day)
                const isDisabled = isDateDisabled(day)

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={cn(
                      'h-8 w-full rounded-none flex items-center justify-center',
                      'text-[10px] font-medium transition-all duration-200',
                      !isLastColumn && 'border-r border-border',
                      !isLastRow && 'border-b border-border',
                      'hover:bg-secondary',
                      isSelected && 'bg-primary text-white hover:bg-primary/80',
                      isCurrentDay && !isSelected && 'border border-primary text-primary',
                      isDisabled && 'text-border-dark cursor-not-allowed hover:bg-transparent',
                      !isSelected && !isCurrentDay && !isDisabled && 'text-foreground'
                    )}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>

            {/* Today Button */}
            <div className="mt-1.5 pt-1.5">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="w-full py-1.5 text-xs font-medium text-primary hover:bg-secondary rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
            </div>
          </FloatingPortal>
        )
      )}

      {error && (
        <motion.p
          {...(shouldAnimate ? { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } } : {})}
          className="mt-1.5 text-sm text-error"
        >
          {error}
        </motion.p>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-sm text-primary/70">{hint}</p>
      )}
    </div>
  )
}
