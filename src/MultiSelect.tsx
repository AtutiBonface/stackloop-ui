'use client'

import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from './utils'
import { FloatingPortal } from './FloatingPortal'
import { Checkbox } from './Checkbox'

export interface MultiSelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface MultiSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  options: MultiSelectOption[]
  value?: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  hint?: string
  searchable?: boolean
  clearable?: boolean
  maxItems?: number
  className?: string
  animate?: boolean
  chipVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = 'Select options...',
      label,
      error,
      hint,
      searchable = false,
      clearable = true,
      maxItems,
      disabled,
      required,
      className,
      animate = true,
      chipVariant = 'primary',
    },
    ref
  ) => {
    const shouldAnimate = animate !== false
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [dropdownPlacement, setDropdownPlacement] = useState<'top' | 'bottom'>('bottom')
    const selectRef = useRef<HTMLDivElement>(null)

    const selectedOptions = options.filter((opt) => value.includes(opt.value))

    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchQuery('')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
      if (!isOpen) return

      const updatePlacement = () => {
        if (!selectRef.current) return

        const rect = selectRef.current.getBoundingClientRect()
        const estimatedMenuHeight = searchable ? 360 : 300
        const availableBelow = window.innerHeight - rect.bottom - 8
        const availableAbove = rect.top - 8

        if (availableBelow >= estimatedMenuHeight) {
          setDropdownPlacement('bottom')
          return
        }

        if (availableAbove >= estimatedMenuHeight) {
          setDropdownPlacement('top')
          return
        }

        setDropdownPlacement('bottom')
      }

      updatePlacement()
      window.addEventListener('resize', updatePlacement)
      window.addEventListener('scroll', updatePlacement, true)

      return () => {
        window.removeEventListener('resize', updatePlacement)
        window.removeEventListener('scroll', updatePlacement, true)
      }
    }, [isOpen, searchable])

    const handleSelect = (optionValue: string) => {
      const newValues = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : maxItems && value.length >= maxItems
          ? value
          : [...value, optionValue]
      onChange(newValues)
    }

    const handleRemoveChip = (optionValue: string) => {
      const newValues = value.filter((v) => v !== optionValue)
      onChange(newValues)
    }

    const handleClearAll = () => {
      onChange([])
    }

    const chipVariantClasses = {
      default: 'bg-secondary text-primary border border-border hover:bg-border',
      primary: 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20',
      success: 'bg-success/10 text-success border border-success/20 hover:bg-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20',
      danger: 'bg-error/10 text-error border border-error/20 hover:bg-error/20',
      info: 'bg-info/10 text-info border border-info/20 hover:bg-info/20',
    }

    const dropdownAnimation =
      dropdownPlacement === 'top'
        ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 } }
        : { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }

    return (
      <div ref={ref} className={cn('w-full space-y-1.5', className)}>
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div ref={selectRef} className="relative">
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (disabled) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsOpen((prev) => !prev)
              }
            }}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-required={required}
            aria-disabled={disabled}
            className={cn(
              'w-full px-4 py-3 rounded-md border transition-all duration-200',
              'bg-background text-left flex items-start justify-between gap-2 flex-wrap',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              disabled && 'bg-secondary cursor-not-allowed',
              'touch-target text-base min-h-12',
              error && 'border-error focus:ring-error',
              !error && 'border-border',
              isOpen && 'ring-2 ring-primary'
            )}
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-2 w-full">
                {selectedOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    layout
                    initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : {}}
                    animate={shouldAnimate ? { opacity: 1, scale: 1 } : {}}
                    exit={shouldAnimate ? { opacity: 0, scale: 0.8 } : {}}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium',
                      chipVariantClasses[chipVariant]
                    )}
                  >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="truncate">{option.label}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveChip(option.value)
                      }}
                      className="shrink-0 ml-0.5 hover:opacity-70 transition-opacity"
                      aria-label={`Remove ${option.label}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <span className={cn('truncate', 'text-foreground/50')}>
                {placeholder}
              </span>
            )}
            <ChevronDown
              className={cn(
                'w-5 h-5 text-primary transition-transform shrink-0 ml-auto',
                isOpen && 'rotate-180'
              )}
            />
          </div>

          {shouldAnimate ? (
            <AnimatePresence>
              {isOpen ? (
                <FloatingPortal open={isOpen} anchorRef={selectRef} placement={dropdownPlacement}>
                  <motion.div
                    initial={dropdownAnimation.initial}
                    animate={dropdownAnimation.animate}
                    exit={dropdownAnimation.exit}
                    transition={{ duration: 0.2 }}
                    role="listbox"
                    className="z-50 w-full bg-background rounded-md border border-border shadow-lg max-h-80 overflow-hidden"
                  >
                    {searchable && (
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label="Search options"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              aria-label="Clear search"
                            >
                              <X className="w-4 h-4 text-primary/50 hover:text-primary" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="overflow-y-auto max-h-64 p-2 space-y-1">
                      {clearable && value.length > 0 && (
                        <button
                          type="button"
                          role="option"
                          onClick={() => handleClearAll()}
                          className={cn(
                            'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                            'hover:bg-secondary transition-colors',
                            'text-foreground/70 italic text-sm'
                          )}
                        >
                          <span>Clear all</span>
                        </button>
                      )}
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => {
                          const isSelected = value.includes(option.value)
                          const isDisabled = option.disabled || (maxItems !== undefined && value.length >= maxItems && !isSelected)
                          return (
                              <div
                              key={option.value}
                              role="option"
                              aria-selected={isSelected}
                                aria-disabled={isDisabled}
                                onClick={() => !isDisabled && handleSelect(option.value)}
                              className={cn(
                                'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                                'hover:bg-secondary transition-colors',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                  isDisabled && 'opacity-50 cursor-not-allowed',
                                isSelected && 'bg-border text-foreground font-medium'
                              )}
                            >
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  onChange={() => !isDisabled && handleSelect(option.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  animate={shouldAnimate}
                                  className="w-5 h-5"
                                  aria-label={option.label}
                                />
                              {option.icon && (
                                <span className="shrink-0">{option.icon}</span>
                              )}
                              <span>{option.label}</span>
                              </div>
                          )
                        })
                      ) : (
                        <div className="px-4 py-6 text-center text-primary/70 text-sm">
                          No options found
                        </div>
                      )}
                    </div>
                  </motion.div>
                </FloatingPortal>
              ) : null}
            </AnimatePresence>
          ) : (
            isOpen && (
              <FloatingPortal open={isOpen} anchorRef={selectRef} placement={dropdownPlacement}>
                <motion.div
                  role="listbox"
                  className="z-50 w-full bg-background rounded-md border border-border shadow-lg max-h-80 overflow-hidden"
                >
                  {searchable && (
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-8 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label="Search options"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            aria-label="Clear search"
                          >
                            <X className="w-4 h-4 text-primary/50 hover:text-primary" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="overflow-y-auto max-h-64 p-2 space-y-1">
                    {clearable && value.length > 0 && (
                      <button
                        type="button"
                        role="option"
                        onClick={() => handleClearAll()}
                        className={cn(
                          'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                          'hover:bg-secondary transition-colors',
                          'text-foreground/70 italic text-sm'
                        )}
                      >
                        <span>Clear all</span>
                      </button>
                    )}
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => {
                        const isSelected = value.includes(option.value)
                          const isDisabled = option.disabled || (maxItems !== undefined && value.length >= maxItems && !isSelected)
                        return (
                            <div
                            key={option.value}
                            role="option"
                            aria-selected={isSelected}
                              aria-disabled={isDisabled}
                              onClick={() => !isDisabled && handleSelect(option.value)}
                            className={cn(
                              'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                              'hover:bg-secondary transition-colors',
                              'disabled:opacity-50 disabled:cursor-not-allowed',
                                isDisabled && 'opacity-50 cursor-not-allowed',
                              isSelected && 'bg-border text-foreground font-medium'
                            )}
                          >
                              <Checkbox
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={() => !isDisabled && handleSelect(option.value)}
                                onClick={(e) => e.stopPropagation()}
                                animate={shouldAnimate}
                                className="w-5 h-5"
                                aria-label={option.label}
                              />
                            {option.icon && (
                              <span className="shrink-0">{option.icon}</span>
                            )}
                            <span>{option.label}</span>
                            </div>
                        )
                      })
                    ) : (
                      <div className="px-4 py-6 text-center text-primary/70 text-sm">
                        No options found
                      </div>
                    )}
                  </div>
                </motion.div>
              </FloatingPortal>
            )
          )}
        </div>

        {error && (
          <motion.p
            {...(shouldAnimate ? { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } } : {})}
            className="text-sm text-error"
          >
            {error}
          </motion.p>
        )}

        {hint && !error && (
          <p className="text-sm text-primary/70">{hint}</p>
        )}
      </div>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'
