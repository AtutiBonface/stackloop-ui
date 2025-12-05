import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from './utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  description?: string
  onChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, checked, defaultChecked, onChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false)
    
    // Use controlled value if provided, otherwise use internal state
    const isChecked = checked !== undefined ? checked : internalChecked
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setInternalChecked(e.target.checked)
      }
      onChange?.(e.target.checked)
    }
    
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            checked={isChecked}
            onChange={handleChange}
            {...props}
          />
          <motion.div
            className={cn(
              'w-6 h-6 rounded-md border-2 transition-all duration-200',
              'peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              'flex items-center justify-center',
              isChecked ? 'bg-primary border-primary' : 'border-border bg-background',
              className
            )}
            whileTap={{ scale: 0.95 }}
          >
            <Check className={cn(
              'w-4 h-4 text-white transition-opacity duration-200',
              isChecked ? 'opacity-100' : 'opacity-0'
            )} />
          </motion.div>
        </div>
        
        {(label || description) && (
          <div className="flex-1 space-y-0.5">
            {label && (
              <div className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                {label}
              </div>
            )}
            {description && (
              <div className="text-sm text-primary/70">{description}</div>
            )}
          </div>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
