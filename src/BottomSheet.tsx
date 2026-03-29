'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from './utils'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  className?: string
  animate?: boolean
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = false,
  className,
  animate = true
}) => {
  const shouldAnimate = animate !== false
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sheetContent = isOpen ? (
    <>
      {/* Backdrop */}
      <motion.div
        {...(shouldAnimate
          ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
          : {})}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Bottom Sheet */}
      <motion.div
        {...(shouldAnimate
          ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring', damping: 30, stiffness: 300 } }
          : {})}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-white rounded-t-3xl shadow-2xl',
          'max-h-[90vh] flex flex-col',
          className
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-border-dark rounded-full" />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 ">
            {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-md border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                aria-label="Close bottom sheet"
              >
                Esc
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </motion.div>
    </>
  ) : null

  return shouldAnimate ? <AnimatePresence>{sheetContent}</AnimatePresence> : sheetContent
}
