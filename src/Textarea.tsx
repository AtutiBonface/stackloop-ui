import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from './utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, required, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-background border border-border rounded-md',
            'text-foreground placeholder:text-foreground/50',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200 resize-vertical',
            'text-base touch-target',
            error && 'border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-error"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-primary/70">{helperText}</p>
        )}
      </motion.div>
    )
  }
)

Textarea.displayName = 'Textarea'
