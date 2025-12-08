'use client'

import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from './utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-primary">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full px-4 py-3 rounded-md border transition-all duration-200',
              'bg-background text-foreground placeholder:text-foreground/50',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:bg-secondary disabled:cursor-not-allowed',
              'touch-target text-base',
              error && 'border-error focus:ring-error',
              !error && 'border-border',
              leftIcon && 'pl-11',
              (rightIcon || isPassword) && 'pr-11',
              className
            )}
            {...props}
          />
          
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-primary hover:text-primary-dark transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          )}
          
          {rightIcon && !isPassword && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-primary">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
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
