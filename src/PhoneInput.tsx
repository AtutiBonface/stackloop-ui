'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from './utils'
import { countries, type Country } from './countries'

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  country?: string
  defaultCountry?: string
  autoDetect?: boolean
  onCountryChange?: (country: Country) => void
  label?: string
  error?: string
  hint?: string
  searchable?: boolean
  showFlags?: boolean
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

const getLocaleCountry = () => {
  if (typeof navigator === 'undefined') return null
  const locale = navigator.language || ''
  const match = locale.match(/[-_](\w{2})$/)
  return match ? match[1].toUpperCase() : null
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  country,
  defaultCountry = 'US',
  autoDetect = true,
  onCountryChange,
  label,
  error,
  hint,
  searchable = true,
  showFlags = true,
  animate = true,
  disabled,
  className,
  placeholder,
  ...inputProps
}) => {
  const shouldAnimate = animate !== false
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [internalCountry, setInternalCountry] = useState<string>(defaultCountry)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastEmittedIso2Ref = useRef<string | null>(null)

  useEffect(() => {
    if (country) {
      setInternalCountry(country.toUpperCase())
    }
  }, [country])

  useEffect(() => {
    if (!country && autoDetect) {
      const localeCountry = getLocaleCountry()
      if (localeCountry) {
        setInternalCountry(localeCountry)
      }
    }
  }, [autoDetect, country])

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

  const selectedCountry = useMemo(() => {
    const iso2 = (country || internalCountry || defaultCountry).toUpperCase()
    return countries.find((item) => item.iso2 === iso2) || countries[0]
  }, [country, internalCountry, defaultCountry])

  useEffect(() => {
    if (!selectedCountry) return
    if (lastEmittedIso2Ref.current === selectedCountry.iso2) return
    lastEmittedIso2Ref.current = selectedCountry.iso2
    onCountryChange?.(selectedCountry)
  }, [selectedCountry, onCountryChange])

  const filteredCountries = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return countries
    const query = searchQuery.toLowerCase()
    return countries.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.iso2.toLowerCase().includes(query) ||
        item.dialCode.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
      )
    })
  }, [searchQuery, searchable])

  const handleCountrySelect = (item: Country) => {
    if (!country) {
      setInternalCountry(item.iso2)
    }
    onCountryChange?.(item)
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
        <div
          className={cn(
            'flex items-stretch rounded-md border transition-all duration-200 bg-background',
            'focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent',
            'disabled:bg-secondary disabled:cursor-not-allowed',
            error ? 'border-error' : 'border-border'
          )}
        >
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-left',
              'border-r border-border/70',
              'hover:bg-secondary transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            {showFlags && (
              <span className="text-base" aria-hidden>
                {getFlagEmoji(selectedCountry.iso2)}
              </span>
            )}
            <span className="text-sm font-medium text-foreground">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-primary transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          <input
            type="tel"
            inputMode="tel"
            value={value ?? ''}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder || 'Phone number'}
            disabled={disabled}
            className={cn(
              'flex-1 px-4 py-2.5 text-base bg-transparent text-foreground',
              'placeholder:text-foreground/50 focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            {...inputProps}
          />
        </div>

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
                {filteredCountries.map((item) => (
                  <button
                    key={item.iso2}
                    type="button"
                    role="option"
                    aria-selected={item.iso2 === selectedCountry.iso2}
                    onClick={() => handleCountrySelect(item)}
                    className={cn(
                      'w-full px-3 py-2 text-left flex items-start gap-2 rounded-sm cursor-pointer',
                      'hover:bg-secondary transition-colors',
                      item.iso2 === selectedCountry.iso2 && 'bg-border text-foreground'
                    )}
                  >
                    {showFlags && (
                      <span className="text-base" aria-hidden>
                        {getFlagEmoji(item.iso2)}
                      </span>
                    )}
                    <span className="text-sm font-medium text-foreground break-words whitespace-normal">
                      {item.name}
                    </span>
                    <span className="ml-auto text-xs text-primary/70">
                      {item.dialCode}
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
              {filteredCountries.map((item) => (
                <button
                  key={item.iso2}
                  type="button"
                  role="option"
                  aria-selected={item.iso2 === selectedCountry.iso2}
                  onClick={() => handleCountrySelect(item)}
                  className={cn(
                    'w-full px-3 py-2 text-left flex items-start gap-2 rounded-sm cursor-pointer',
                    'hover:bg-secondary transition-colors',
                    item.iso2 === selectedCountry.iso2 && 'bg-border text-foreground'
                  )}
                >
                  {showFlags && (
                    <span className="text-base" aria-hidden>
                      {getFlagEmoji(item.iso2)}
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground break-words whitespace-normal">
                    {item.name}
                  </span>
                  <span className="ml-auto text-xs text-primary/70">
                    {item.dialCode}
                  </span>
                </button>
              ))}
            </div>
            </div>
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

PhoneInput.displayName = 'PhoneInput'
