'use client'

import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from './utils'
import { DatePicker } from './DatePicker'
import { CountrySelect } from './CountrySelect'
import { PhoneInput } from './PhoneInput'

type SmartInputType = React.HTMLInputTypeAttribute | 'country' | 'phone'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  type?: SmartInputType
  value?: string | number | readonly string[] | Date
  onChange?: (value: string | Date) => void
  onValueChange?: (value: string | Date) => void
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  animate?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      animate = true,
      className,
      type,
      value,
      placeholder,
      disabled,
      required,
      onChange,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const shouldAnimate = animate !== false
    const [showPassword, setShowPassword] = useState(false)

    const emitValueChange = (nextValue: string | Date) => {
      onChange?.(nextValue)
      onValueChange?.(nextValue)
    }

    if (type === 'phone') {
      return (
        <PhoneInput
          label={label}
          error={error}
          hint={hint}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          animate={animate}
          value={typeof value === 'string' ? value : ''}
          onChange={(nextValue) => emitValueChange(nextValue)}
          className={className}
        />
      )
    }

    if (type === 'country') {
      return (
        <CountrySelect
          label={label}
          error={error}
          hint={hint}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          animate={animate}
          value={typeof value === 'string' ? value : ''}
          onChange={(nextValue) => emitValueChange(nextValue)}
          className={className}
        />
      )
    }

    if (type === 'date') {
      return (
        <DatePicker
          label={label}
          error={error}
          hint={hint}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          animate={animate}
          value={value instanceof Date ? value : undefined}
          onChange={(nextValue) => emitValueChange(nextValue)}
          className={className}
        />
      )
    }

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute flex items-center pointer-events-none text-primary" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full rounded-md border transition-all duration-200',
              'bg-background text-foreground placeholder:text-foreground/50',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:bg-secondary disabled:cursor-not-allowed',
              'touch-target text-base',
              error && 'border-error focus:ring-error',
              !error && 'border-border',
              className
            )}
            style={{
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: leftIcon ? '44px' : '16px',
              paddingRight: (rightIcon || isPassword) ? '44px' : '16px',
            }}
            value={value as string | number | readonly string[] | undefined}
            onChange={(event) => emitValueChange(event.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            
            {...props}
          />
          
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-primary hover:text-primary-dark transition-colors"
              style={{ 
                right: '14px', 
                top: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              whileTap={shouldAnimate ? { scale: 0.9, y: '-50%' } : undefined}
              animate={{ y: '-50%' }}
              transition={shouldAnimate ? { duration: 0.1 } : { duration: 0 }}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          )}
          
          {rightIcon && !isPassword && (
            <div className="absolute flex items-center pointer-events-none text-primary" style={{ right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
              {rightIcon}
            </div>
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

Input.displayName = 'Input'
