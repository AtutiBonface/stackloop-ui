'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from './utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'bg-background border border-border rounded-lg shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col',
              sizeClasses[size],
              className
            )}
          >
            {title && (
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export const ModalContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => <div className={cn('px-6 py-4', className)}>{children}</div>

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-background sticky bottom-0', className)}>
    {children}
  </div>
)
