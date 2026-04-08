'use client'

import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from './utils'
import { DatePicker } from './DatePicker'
import { CountrySelect } from './CountrySelect'
import { PhoneInput } from './PhoneInput'

type InputValue = string | Date

type NativeInputType = Exclude<React.HTMLInputTypeAttribute, 'date' | 'phone' | 'country' | 'tel'>

type NativeInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  type?: NativeInputType
  value?: string | number | readonly string[]
  onChange?: (value: InputValue) => void
  onValueChange?: (value: InputValue) => void
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  animate?: boolean
}

type PhoneInputFieldProps = Omit<React.ComponentProps<typeof PhoneInput>, 'value' | 'onChange'> & {
  type: 'phone' | 'tel'
  value?: string
  onChange?: (value: InputValue) => void
  onValueChange?: (value: InputValue) => void
}

type CountrySelectInputProps = Omit<React.ComponentProps<typeof CountrySelect>, 'value' | 'onChange'> & {
  type: 'country'
  value?: string
  onChange?: (value: InputValue) => void
  onValueChange?: (value: InputValue) => void
}

type DatePickerInputProps = Omit<React.ComponentProps<typeof DatePicker>, 'value' | 'onChange'> & {
  type: 'date'
  value?: Date
  onChange?: (value: InputValue) => void
  onValueChange?: (value: InputValue) => void
}

export type InputProps = NativeInputProps | PhoneInputFieldProps | CountrySelectInputProps | DatePickerInputProps

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const shouldAnimate = props.animate !== false
    const [showPassword, setShowPassword] = useState(false)
    const emitValueChange = (nextValue: InputValue) => {
      props.onChange?.(nextValue)
      props.onValueChange?.(nextValue)
    }

    if (props.type === 'phone' || props.type === 'tel') {
      const { type, value, onChange, onValueChange, ...phoneProps } = props
      return (
        <PhoneInput
          {...phoneProps}
          value={typeof value === 'string' ? value : ''}
          onChange={(nextValue) => emitValueChange(nextValue)}
        />
      )
    }

    if (props.type === 'country') {
      const { type, value, onChange, onValueChange, ...countryProps } = props
      return (
        <CountrySelect
          {...countryProps}
          value={typeof value === 'string' ? value : ''}
          onChange={(nextValue) => emitValueChange(nextValue)}
        />
      )
    }

    if (props.type === 'date') {
      const { type, value, onChange, onValueChange, ...dateProps } = props
      return (
        <DatePicker
          {...dateProps}
          value={value instanceof Date ? value : undefined}
          onChange={(nextValue) => emitValueChange(nextValue)}
        />
      )
    }

    const nativeProps = props as NativeInputProps
    const {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      animate,
      className,
      type,
      value,
      placeholder,
      disabled,
      required,
      onChange,
      onValueChange,
      onWheel,
      ...propsForInput
    } = nativeProps

    const shouldSuppressNumberSteppers = type === 'number'

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
              shouldSuppressNumberSteppers && 'number-input',
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
            onWheel={shouldSuppressNumberSteppers ? (event) => {
              event.preventDefault()
              onWheel?.(event)
            } : onWheel}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            
            {...propsForInput}
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
