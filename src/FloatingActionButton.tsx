'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { cn } from './utils'

export interface FABAction {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'success' | 'danger' | 'warning'
  labelClassName?: string
  labelStyle?: React.CSSProperties
}

export interface FloatingActionButtonProps {
  icon?: React.ReactNode
  onClick?: () => void
  label?: string
  actions?: FABAction[]
  variant?: 'primary' | 'secondary'
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  disabled?: boolean
  className?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  label,
  actions,
  variant = 'primary',
  position = 'bottom-right',
  disabled,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2'
  }

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg',
    secondary: 'bg-background text-primary border-2 border-primary hover:bg-secondary shadow-md'
  }

  const actionVariants = {
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    danger: 'bg-error text-white',
    warning: 'bg-warning text-white'
  }

  const handleMainClick = () => {
    if (actions && actions.length > 0) {
      setIsOpen(!isOpen)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div className={cn(positions[position], 'z-50', className)}>
      <AnimatePresence>
        {isOpen && actions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <span 
                  className={cn(
                    'bg-background border border-border rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap shadow-lg',
                    action.labelClassName
                  )}
                  style={action.labelStyle}
                >
                  {action.label}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    action.onClick()
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all',
                    actionVariants[action.variant || 'primary']
                  )}
                >
                  {action.icon}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        onClick={handleMainClick}
        disabled={disabled}
        className={cn(
          'z-30 rounded-full p-4 transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center gap-2',
          variants[variant],
          label ? 'px-6' : 'w-16 h-16 justify-center',
          isOpen && 'rotate-45'
        )}
      >
        <span className="flex-shrink-0">
          {icon || (isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />)}
        </span>
        {label && <span className="font-medium">{label}</span>}
      </motion.button>
    </div>
  )
}

export const FAB = FloatingActionButton

