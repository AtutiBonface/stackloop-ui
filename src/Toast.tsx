'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from './utils'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default' | 'loading'
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface Toast {
  id: string
  message: string
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const variantStyles = {
  success: 'bg-success text-white border-success',
  error: 'bg-error text-white border-error',
  warning: 'bg-warning text-white border-warning',
  info: 'bg-info text-white border-info',
  loading: 'bg-primary text-white border-primary',
  default: 'bg-background text-foreground border-border'
}

const variantIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
  default: null
}

const positionStyles = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4'
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
  animate?: boolean
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, animate = true }) => {
  const shouldAnimate = animate !== false
  const variant = toast.variant || 'default'
  const Icon = variantIcons[variant]
  const isLoading = variant === 'loading'
  
  // Ensure message is always a string
  const messageText = typeof toast.message === 'string' 
    ? toast.message 
    : String(toast.message)

  const Container = shouldAnimate ? motion.div : 'div'

  return (
    <Container
      {...(shouldAnimate
        ? {
            layout: true,
            initial: { opacity: 0, y: -20, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, x: 100, scale: 0.95 },
            transition: { duration: 0.2 }
          }
        : {})}
      className={cn(
        'flex items-start gap-3 p-4 rounded-md border shadow-lg min-w-80 max-w-md',
        variantStyles[variant]
      )}
    >
      {Icon && (
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', isLoading && 'animate-spin')} />
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed">{messageText}</p>
        
        {toast.action && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={toast.action.onClick}
              className="inline-flex h-8 items-center rounded-sm border border-current/30 px-3 text-xs font-semibold transition-colors hover:bg-current/10"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </Container>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
  animate?: boolean
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
  animate = true
}) => {
  const shouldAnimate = animate !== false
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      // Type guard to ensure message is a string
      if (typeof toast.message !== 'string') {
        console.error('Toast message must be a string, received:', toast.message)
        return
      }

      const id = Math.random().toString(36).substring(2, 9)
      const duration = toast.duration ?? 5000

      setToasts((prev) => {
        const newToasts = [...prev, { ...toast, id }]
        return newToasts.slice(-maxToasts)
      })

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [maxToasts, removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      <div className={cn('fixed z-100 flex flex-col gap-2', positionStyles[position])}>
        {shouldAnimate ? (
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onRemove={removeToast} animate={shouldAnimate} />
            ))}
          </AnimatePresence>
        ) : (
          toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} animate={shouldAnimate} />
          ))
        )}
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'
