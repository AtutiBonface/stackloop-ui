'use client'

import React, { useMemo } from 'react'
import { Select } from './Select'
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
  const options = useMemo(
    () =>
      countries.map((country) => ({
        label: country.name,
        value: country.iso2,
        icon: showFlags ? (
          <span className="text-base" aria-hidden>
            {getFlagEmoji(country.iso2)}
          </span>
        ) : undefined
      })),
    [showFlags]
  )

  const handleChange = (iso2: string) => {
    onChange?.(iso2)
    const selected = countries.find((item) => item.iso2 === iso2)
    if (selected) {
      onCountryChange?.(selected)
    }
  }

  return (
    <Select
      label={label}
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={handleChange}
      searchable={searchable}
      clearable={clearable}
      disabled={disabled}
      animate={animate}
      className={className}
    />
  )
}

CountrySelect.displayName = 'CountrySelect'
