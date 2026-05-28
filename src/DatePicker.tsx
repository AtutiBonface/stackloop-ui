'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dropdown } from './Dropdown'
import { cn } from './utils'
import { FloatingPortal } from './FloatingPortal'

export interface DatePickerProps {
  value?: Date
  onChange: (date: Date) => void
  mode?: 'date' | 'time' | 'datetime-local'
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

const pad = (input: number) => String(input).padStart(2, '0')

const periodOptions = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
]

const panelAnimation = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  mode = 'date',
  label,
  required,
  placeholder,
  error,
  hint,
  disabled,
  minDate,
  maxDate,
  className,
  animate = true,
}) => {
  const shouldAnimate = animate !== false
  const [isOpen, setIsOpen] = useState(false)
  const [pickerPosition, setPickerPosition] = useState<'bottom' | 'top'>('bottom')
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false)
  const [monthMenuPosition, setMonthMenuPosition] = useState<'bottom' | 'top'>('bottom')
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false)
  const [yearMenuPosition, setYearMenuPosition] = useState<'bottom' | 'top'>('bottom')
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date())
  const [hourInput, setHourInput] = useState('')
  const [minuteInput, setMinuteInput] = useState('')

  const datePickerRef = useRef<HTMLDivElement>(null)
  const pickerTriggerRef = useRef<HTMLButtonElement>(null)
  const monthMenuTriggerRef = useRef<HTMLButtonElement>(null)
  const monthMenuRef = useRef<HTMLDivElement>(null)
  const yearMenuTriggerRef = useRef<HTMLButtonElement>(null)
  const yearMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setCurrentMonth(value)
    }
  }, [value])

  const timeBase = value || new Date()
  const selectedHour24 = timeBase.getHours()
  const selectedMinute = timeBase.getMinutes()
  const selectedHour12 = (() => {
    const normalized = selectedHour24 % 12
    return normalized === 0 ? 12 : normalized
  })()
  const selectedPeriod = selectedHour24 >= 12 ? 'PM' : 'AM'

  useEffect(() => {
    setHourInput(`${selectedHour12}`)
    setMinuteInput(pad(selectedMinute))
  }, [selectedHour12, selectedMinute])

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getPlaceholder = () => {
    if (placeholder) return placeholder
    if (mode === 'time') return 'Select time'
    if (mode === 'datetime-local') return 'Select date and time'
    return 'Select date'
  }

  const getDisplayValue = () => {
    if (!value) return ''
    if (mode === 'time') return formatTime(value)
    if (mode === 'datetime-local') return formatDateTime(value)
    return formatDate(value)
  }

  const setTimeValue = (hours: number, minutes: number) => {
    const nextDate = new Date(value || new Date())
    nextDate.setHours(hours, minutes, 0, 0)
    onChange(nextDate)
  }

  const setTimeFrom12Hour = (hour12: number, minutes: number, period: 'AM' | 'PM') => {
    const normalizedHour = hour12 % 12
    const nextHours = period === 'PM' ? normalizedHour + 12 : normalizedHour
    setTimeValue(nextHours, minutes)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
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

  const days = getDaysInMonth(currentMonth)
  const currentYear = currentMonth.getFullYear()
  const currentMonthIndex = currentMonth.getMonth()
  const startYear = minDate ? minDate.getFullYear() : currentYear - 100
  const endYear = maxDate ? maxDate.getFullYear() : currentYear + 20
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)

  const isSameDay = (left: Date | null, right: Date | null) => {
    if (!left || !right) return false
    return (
      left.getDate() === right.getDate() &&
      left.getMonth() === right.getMonth() &&
      left.getFullYear() === right.getFullYear()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    return isSameDay(date, new Date())
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

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

  const handleDateSelect = (date: Date) => {
    if (mode === 'datetime-local') {
      const nextDate = new Date(value || new Date())
      nextDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      onChange(nextDate)
      return
    }

    onChange(date)
    setIsOpen(false)
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
      const estimatedMenuHeight = mode === 'date' ? 430 : 360
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
  }, [isOpen, mode])

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

  const handleHourTyping = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 2)
    setHourInput(digitsOnly)

    if (!digitsOnly) return

    const parsedHour = Number(digitsOnly)
    if (parsedHour >= 1 && parsedHour <= 12) {
      setTimeFrom12Hour(parsedHour, selectedMinute, selectedPeriod)
    }
  }

  const handleMinuteTyping = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 2)
    setMinuteInput(digitsOnly)

    // Wait for the user to type two digits before applying to avoid
    // the value being updated mid-typing (so typing "50" works).
    if (digitsOnly.length !== 2) return

    const parsedMinute = Number(digitsOnly)
    if (parsedMinute >= 0 && parsedMinute <= 59) {
      setTimeFrom12Hour(selectedHour12, parsedMinute, selectedPeriod)
    }
  }

  const commitHourInput = () => {
    if (!hourInput) {
      setHourInput(`${selectedHour12}`)
      return
    }

    const parsedHour = Number(hourInput)
    const clampedHour = Math.min(12, Math.max(1, Number.isNaN(parsedHour) ? selectedHour12 : parsedHour))
    setHourInput(`${clampedHour}`)
    setTimeFrom12Hour(clampedHour, selectedMinute, selectedPeriod)
  }

  const commitMinuteInput = () => {
    if (!minuteInput) {
      setMinuteInput(pad(selectedMinute))
      return
    }

    const parsedMinute = Number(minuteInput)
    const clampedMinute = Math.min(59, Math.max(0, Number.isNaN(parsedMinute) ? selectedMinute : parsedMinute))
    setMinuteInput(pad(clampedMinute))
    setTimeFrom12Hour(selectedHour12, clampedMinute, selectedPeriod)
  }

  const renderTimeControls = () => (
    <div className="grid grid-cols-3 gap-2 items-end">
      <div className="space-y-1">
        <label className="block text-[10px] font-medium text-foreground/70">Hour</label>
        <input
          inputMode="numeric"
          value={hourInput}
          onChange={(event) => handleHourTyping(event.target.value)}
          onBlur={commitHourInput}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commitHourInput()
              event.currentTarget.blur()
            }
          }}
          placeholder="hh"
          className="h-11 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[10px] font-medium text-foreground/70">Minute</label>
        <input
          inputMode="numeric"
          value={minuteInput}
          onChange={(event) => handleMinuteTyping(event.target.value)}
          onBlur={commitMinuteInput}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commitMinuteInput()
              event.currentTarget.blur()
            }
          }}
          placeholder="mm"
          className="h-11 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30"
        />
      </div>

      <Dropdown
        label="AM/PM"
        options={periodOptions}
        value={selectedPeriod}
        onChange={(nextPeriod) => setTimeFrom12Hour(selectedHour12, selectedMinute, nextPeriod as 'AM' | 'PM')}
        searchable={false}
        clearable={false}
        className="[&_label]:text-[10px] [&_label]:mb-1 [&_button]:h-11 [&_button]:min-h-0 [&_button]:py-0 [&_button]:px-2 [&_button]:text-sm [&_button_svg]:w-3 [&_button_svg]:h-3"
      />
    </div>
  )

  const renderCalendar = () => (
    <>
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

      <div className="grid grid-cols-7 gap-0 mb-1">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-foreground/70 py-1">
            {day}
          </div>
        ))}
      </div>

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

      {mode !== 'datetime-local' && (
        <div className="mt-1.5">
          <button
            type="button"
            onClick={() => handleDateSelect(new Date())}
            className="w-full py-1.5 text-xs font-medium text-primary cursor-pointer hover:bg-secondary rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      )}
    </>
  )

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
        onClick={() => !disabled && setIsOpen((current) => !current)}
        disabled={disabled}
        aria-required={required}
        className={cn(
          'w-full px-4 py-3 rounded-md border transition-all duration-200',
          'bg-background text-left flex items-center justify-between gap-2 text-foreground',
          'focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30',
          'disabled:bg-secondary disabled:text-border-dark disabled:cursor-not-allowed',
          'touch-target',
          error && 'border-error',
          !error && 'border-border',
          isOpen && 'ring-1 ring-primary/30'
        )}
      >
        <span className={cn('truncate', !value && 'text-foreground/50', disabled && 'text-border-dark')}>
          {value ? getDisplayValue() : getPlaceholder()}
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
                {mode === 'time' ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-medium text-foreground/70 mb-1">Choose time</label>
                      {renderTimeControls()}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-secondary transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>{renderCalendar()}</div>

                    {mode === 'datetime-local' && (
                      <div className="space-y-2 pt-1">
                        <div>{renderTimeControls()}</div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-secondary transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </FloatingPortal>
          ) : null}
        </AnimatePresence>
      ) : (
        isOpen && (
          <FloatingPortal open={isOpen} anchorRef={pickerTriggerRef} placement={pickerPosition} matchWidth={false}>
            <div
              className="z-50 w-72 bg-background rounded-md border border-border shadow-lg p-2.5"
            >
              {mode === 'time' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-medium text-foreground/70 mb-1">Choose time</label>
                    {renderTimeControls()}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-secondary transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>{renderCalendar()}</div>

                  {mode === 'datetime-local' && (
                    <div className="space-y-2 pt-1">
                      <div>{renderTimeControls()}</div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-secondary transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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

      {hint && !error && <p className="mt-1.5 text-sm text-primary/70">{hint}</p>}
    </div>
  )
}

export default DatePicker