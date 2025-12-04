import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-0 pl-3.5 inset-y-0 flex items-center pointer-events-none text-neutral-500">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-md border transition-all duration-200',
              'bg-white text-neutral-900 placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-neutral-100 disabled:cursor-not-allowed',
              'touch-target text-base',
              error && 'border-error focus:ring-error',
              !error && 'border-neutral-300',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-0 pr-3.5 inset-y-0 flex items-center pointer-events-none text-neutral-500">
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
          <p className="text-sm text-neutral-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
