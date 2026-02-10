'use client'

import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from './utils'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  hint?: string
  searchable?: boolean
  clearable?: boolean
  className?: string
  animate?: boolean
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      error,
      hint,
      searchable = false,
      clearable = true,
      disabled,
      required,
      className,
      animate = true,
    },
    ref
  ) => {
    const shouldAnimate = animate !== false
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const selectRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

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

    const handleSelect = (optionValue: string) => {
      onChange(optionValue)
      setIsOpen(false)
      setSearchQuery('')
    }

    

    return (
      <div ref={ref} className={cn('w-full space-y-1.5', className)}>
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div ref={selectRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-required={required}
            className={cn(
              'w-full px-4 py-3 rounded-md border transition-all duration-200',
              'bg-background text-left flex items-center justify-between gap-2',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:bg-secondary disabled:cursor-not-allowed',
              'touch-target text-base',
              error && 'border-error focus:ring-error',
              !error && 'border-border',
              isOpen && 'ring-2 ring-primary'
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedOption?.icon && (
                <span className="flex-shrink-0">{selectedOption.icon}</span>
              )}
              <span className={cn('truncate', !selectedOption && 'text-foreground/50')}>
                {selectedOption?.label || placeholder}
              </span>
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-primary transition-transform flex-shrink-0',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {shouldAnimate ? (
            <AnimatePresence>
              {isOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  role="listbox"
                  className="absolute right-0 z-50 mt-2 w-max min-w-48 max-w-full bg-background rounded-md border border-border shadow-lg max-h-80 overflow-hidden"
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
                  {clearable && (
                    <button
                      type="button"
                      role="option"
                      aria-selected={!value}
                      onClick={() => handleSelect('')}
                      className={cn(
                        'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                        'hover:bg-secondary transition-colors',
                        'text-foreground/70 italic',
                        !value && 'bg-border text-foreground font-medium'
                      )}
                    >
                      <span>None</span>
                    </button>
                  )}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={option.value === value}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                          'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                          'hover:bg-secondary transition-colors',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          option.value === value && 'bg-border text-foreground font-medium'
                        )}
                      >
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        <span>{option.label}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-primary/70 text-sm">
                      No options found
                    </div>
                  )}
                </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          ) : (
            isOpen && (
              <motion.div
                role="listbox"
                className="absolute right-0 z-50 mt-2 w-max min-w-48 max-w-full bg-background rounded-md border border-border shadow-lg max-h-80 overflow-hidden"
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
                  {clearable && (
                    <button
                      type="button"
                      role="option"
                      aria-selected={!value}
                      onClick={() => handleSelect('')}
                      className={cn(
                        'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                        'hover:bg-secondary transition-colors',
                        'text-foreground/70 italic',
                        !value && 'bg-border text-foreground font-medium'
                      )}
                    >
                      <span>None</span>
                    </button>
                  )}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={option.value === value}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                          'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                          'hover:bg-secondary transition-colors',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          option.value === value && 'bg-border text-foreground font-medium'
                        )}
                      >
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        <span>{option.label}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-primary/70 text-sm">
                      No options found
                    </div>
                  )}
                </div>
              </motion.div>
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

Select.displayName = 'Select'
