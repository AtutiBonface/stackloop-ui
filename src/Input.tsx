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
                transform: 'translateY(-50%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
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
            <div className="absolute flex items-center pointer-events-none text-primary" style={{ right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
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
