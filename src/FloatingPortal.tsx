'use client'

import React, { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './utils'

interface FloatingPortalProps {
  open: boolean
  anchorRef: React.RefObject<HTMLElement | null>
  placement: 'top' | 'bottom'
  children: React.ReactNode
  className?: string
  offset?: number
  matchWidth?: boolean
}

export const FloatingPortal: React.FC<FloatingPortalProps> = ({
  open,
  anchorRef,
  placement,
  children,
  className,
  offset = 8,
  matchWidth = true,
}) => {
  const [mounted, setMounted] = useState(false)
  const [style, setStyle] = useState<CSSProperties | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const updatePosition = useCallback(() => {
    if (!open || !anchorRef.current) return

    const rect = anchorRef.current.getBoundingClientRect()

    setStyle({
      position: 'fixed',
      top: placement === 'top' ? rect.top - offset : rect.bottom + offset,
      left: rect.left,
      width: matchWidth ? rect.width : undefined,
      zIndex: 70,
    })
  }, [anchorRef, matchWidth, offset, open, placement])

  useEffect(() => {
    if (!open) return

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, updatePosition])

  if (!mounted || !open || !style) {
    return null
  }

  return createPortal(
    <div
      style={style}
      onMouseDown={(event) => event.stopPropagation()}
      className={cn(placement === 'top' && '-translate-y-full', className)}
    >
      {children}
    </div>,
    document.body
  )
}
