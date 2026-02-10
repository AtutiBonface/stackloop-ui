'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from './utils'
import { countries, type Country } from './countries'

export interface CountrySelectProps {
  value?: string
  onChange?: (value: string) => void
  onCountryChange?: (country: Country) => void
  label?: string
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  showFlags?: boolean
  disabled?: boolean
  animate?: boolean
  className?: string
}

const getFlagEmoji = (iso2: string) => {
  const codePoints = iso2
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  onCountryChange,
  label = 'Country',
  placeholder = 'Select country',
  searchable = true,
  clearable = true,
  showFlags = true,
  disabled,
  animate = true,
  className
}) => {
  const shouldAnimate = animate !== false
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCountry = useMemo(
    () => countries.find((country) => country.iso2 === value),
    [value]
  )

  const filteredCountries = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return countries
    const query = searchQuery.toLowerCase()
    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(query) ||
        country.iso2.toLowerCase().includes(query) ||
        country.dialCode.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
      )
    })
  }, [searchQuery, searchable])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (iso2: string) => {
    onChange?.(iso2)
    const selected = countries.find((item) => item.iso2 === iso2)
    if (selected) {
      onCountryChange?.(selected)
    }
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div ref={containerRef} className={cn('w-full space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            'w-full px-4 py-3 rounded-md border transition-all duration-200',
            'bg-background text-left flex items-center justify-between gap-2',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-secondary disabled:cursor-not-allowed',
            'touch-target text-base',
            isOpen && 'ring-2 ring-primary',
            disabled ? 'opacity-50' : 'border-border'
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {showFlags && selectedCountry && (
              <span className="text-base" aria-hidden>
                {getFlagEmoji(selectedCountry.iso2)}
              </span>
            )}
            <span className={cn('truncate', !selectedCountry && 'text-foreground/50')}>
              {selectedCountry ? selectedCountry.name : placeholder}
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
                className="absolute left-0 z-50 mt-2 w-full max-w-full bg-background rounded-md border border-border shadow-lg max-h-80 overflow-hidden overflow-x-hidden"
              >
                {searchable && (
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                      <input
                        type="text"
                        placeholder="Search country or code"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="w-full pl-10 pr-8 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                      onClick={() => handleChange('')}
                      className={cn(
                        'w-full px-3 py-2 text-left flex items-start gap-2 rounded-sm cursor-pointer',
                        'hover:bg-secondary transition-colors',
                        'text-foreground/70 italic',
                        !value && 'bg-border text-foreground'
                      )}
                    >
                      <span>None</span>
                    </button>
                  )}
                  {filteredCountries.map((country) => (
                    <button
                      key={country.iso2}
                      type="button"
                      role="option"
                      aria-selected={country.iso2 === selectedCountry?.iso2}
                      onClick={() => handleChange(country.iso2)}
                      className={cn(
                        'w-full px-3 py-2 text-left flex items-start gap-2 rounded-sm cursor-pointer',
                        'hover:bg-secondary transition-colors',
                        country.iso2 === selectedCountry?.iso2 && 'bg-border text-foreground'
                      )}
                    >
                      {showFlags && (
                        <span className="text-base" aria-hidden>
                          {getFlagEmoji(country.iso2)}
                        </span>
                      )}
                      <span className="text-sm font-medium text-foreground break-words whitespace-normal">
                        {country.name}
                      </span>
                      <span className="ml-auto text-xs text-primary/70">
                        {country.dialCode}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        ) : (
          isOpen && (
            <div
              role="listbox"
              className="absolute left-0 z-50 mt-2 w-full max-w-full bg-background rounded-md border border-border shadow-lg max-h-80 overflow-hidden overflow-x-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                    <input
                      type="text"
                      placeholder="Search country or code"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="w-full pl-10 pr-8 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                    onClick={() => handleChange('')}
                    className={cn(
                      'w-full px-3 py-2 text-left flex items-start gap-2 rounded-sm cursor-pointer',
                      'hover:bg-secondary transition-colors',
                      'text-foreground/70 italic',
                      !value && 'bg-border text-foreground'
                    )}
                  >
                    <span>None</span>
                  </button>
                )}
                {filteredCountries.map((country) => (
                  <button
                    key={country.iso2}
                    type="button"
                    role="option"
                    aria-selected={country.iso2 === selectedCountry?.iso2}
                    onClick={() => handleChange(country.iso2)}
                    className={cn(
                      'w-full px-3 py-2 text-left flex items-start gap-2 rounded-sm cursor-pointer',
                      'hover:bg-secondary transition-colors',
                      country.iso2 === selectedCountry?.iso2 && 'bg-border text-foreground'
                    )}
                  >
                    {showFlags && (
                      <span className="text-base" aria-hidden>
                        {getFlagEmoji(country.iso2)}
                      </span>
                    )}
                    <span className="text-sm font-medium text-foreground break-words whitespace-normal">
                      {country.name}
                    </span>
                    <span className="ml-auto text-xs text-primary/70">
                      {country.dialCode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

CountrySelect.displayName = 'CountrySelect'
