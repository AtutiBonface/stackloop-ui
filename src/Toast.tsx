'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Bell, Check, Info, Loader2, X } from 'lucide-react'
import { cn } from './utils'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default' | 'loading'
export type ToastPriority = 'normal' | 'high'
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface Toast {
  id: string
  message: string
  variant?: ToastVariant
  priority?: ToastPriority
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
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
  success: Check,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
  default: Bell
}

const positionStyles = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4'
}

// 🟦 Dynamic Island Toast Component
const DynamicIslandToast: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {  
  const [phase, setPhase] = useState<'entering' | 'expanded' | 'collapsing' | 'exiting'>('entering')
  const [isHovered, setIsHovered] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const Icon = variantIcons[toast.variant || 'default']
  const duration = toast.duration ?? 4000

  // Independent lifecycle timer
  useEffect(() => {
    if (isHovered) {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      return
    }

    const expandAt = 80
    const collapseAt = Math.max(1200, duration - 600)
    const exitAt = Math.max(1200, duration - 200)
    const removeAt = exitAt + 400

    const t1 = setTimeout(() => setPhase('expanded'), expandAt)
    const t2 = setTimeout(() => setPhase('collapsing'), collapseAt)
    const t3 = setTimeout(() => setPhase('exiting'), exitAt)
    const t4 = setTimeout(() => onRemove(toast.id), removeAt)

    timersRef.current = [t1, t2, t3, t4]
    return () => timersRef.current.forEach(clearTimeout)
  }, [duration, isHovered, onRemove, toast.id])

  const morphVariants = {
    entering: { width: '3rem', height: '3rem', opacity: 0, scale: 0.7, borderRadius: 9999 },
    expanded: { width: 'fit-content', height: 'auto', opacity: 1, scale: 1, borderRadius: '1.5rem' },
    collapsing: { width: 'fit-content', height: 'auto', opacity: 0.8, scale: 1, borderRadius: '1.5rem' },
    exiting: { width: '2rem', height: '2rem', opacity: 0, scale: 0.4, borderRadius: 9999 }
  }

  return (
    <motion.div
      initial="entering"
      animate={phase}
      variants={morphVariants}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'pointer-events-auto inline-flex w-fit max-w-[min(88vw,26rem)] overflow-hidden border backdrop-blur-md shadow-2xl',
        'border-b border-white/15 last:border-b-0', // 🔸 Dividers
        variantStyles[toast.variant || 'default'],   // 🔸 Individual background
        'items-center justify-center'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (toast.action) {
          toast.action.onClick()
          onRemove(toast.id)
        }
      }}
    >
      {/* Icon always visible */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
        <Icon className={cn('h-5 w-5', toast.variant === 'loading' && 'animate-spin')} />
      </div>

      {/* Content fades in/out during morph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'expanded' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="flex min-w-0 flex-1 items-center gap-2 px-3 pr-4"
        style={{ pointerEvents: phase === 'expanded' ? 'auto' : 'none' }}
      >
        <p className="min-w-0 truncate text-sm font-medium">{toast.message}</p>
        {toast.priority === 'high' && (
          <span className="shrink-0 rounded-full border border-current/30 bg-current/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            High
          </span>
        )}
      </motion.div>

      {/* Close button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase === 'expanded' ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); onRemove(toast.id) }}
        className="shrink-0 p-2 text-current/70 transition-colors hover:bg-current/10 hover:text-current"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-center',
  maxToasts = 4
}) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { ...toast, id }
      
      setToasts((prev) => {
        const next = [newToast, ...prev]
        return next.length > maxToasts ? next.slice(0, maxToasts) : next
      })
    },
    [maxToasts]
  )

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className={cn('fixed z-50 flex flex-col items-center gap-3 px-4 pointer-events-none', positionStyles[position])}>
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((toast) => (
            <DynamicIslandToast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'