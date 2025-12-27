'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from './utils'

export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  searchable = false,
  clearable = true,
  disabled,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  
  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div ref={dropdownRef} className={cn('relative w-full', className)}>
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
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-background rounded-md border border-border shadow-lg max-h-80 overflow-hidden"
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
                    className="w-full pl-10 pr-8 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-primary/50 hover:text-primary" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-y-auto max-h-64 p-2">
              {clearable && (
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className={cn(
                    'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                    'hover:bg-secondary transition-colors',
                    'text-foreground/70 italic',
                    !value && 'bg-border text-foreground'
                  )}
                >
                  <span>None</span>
                </button>
              )}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full px-4 py-3 text-left flex items-center gap-2 rounded-sm cursor-pointer',
                      'hover:bg-secondary transition-colors',
                      option.value === value && 'bg-border text-foreground'
                    )}
                  >
                    {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
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
