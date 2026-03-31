'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './utils'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: TooltipSide
  offset?: number
  delay?: number
  disabled?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  showArrow?: boolean
  arrowSize?: number
  arrowClassName?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'bottom',
  offset = 10,
  delay = 120,
  disabled = false,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  showArrow = true,
  arrowSize = 10,
  arrowClassName,
}) => {
  const [mounted, setMounted] = useState(false)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [resolvedSide, setResolvedSide] = useState<TooltipSide>(side)
  const [resolvedInlineAlign, setResolvedInlineAlign] = useState<'start' | 'end' | 'center'>('center')
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const openTimerRef = useRef<number | null>(null)

  const isControlled = open !== undefined
  const isOpen = isControlled ? Boolean(open) : uncontrolledOpen

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }, [])

  const openWithDelay = useCallback(() => {
    if (disabled) return
    clearOpenTimer()
    openTimerRef.current = window.setTimeout(() => {
      setOpen(true)
    }, Math.max(0, delay))
  }, [clearOpenTimer, delay, disabled, setOpen])

  const closeNow = useCallback(() => {
    clearOpenTimer()
    setOpen(false)
  }, [clearOpenTimer, setOpen])

  const updatePosition = useCallback(() => {
    if (!isOpen || !triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewportPadding = 8

    const availableRight = window.innerWidth - triggerRect.right - viewportPadding
    const availableLeft = triggerRect.left - viewportPadding
    const availableTop = triggerRect.top - viewportPadding
    const availableBottom = window.innerHeight - triggerRect.bottom - viewportPadding

    const fitsBySide: Record<TooltipSide, boolean> = {
      right: availableRight >= tooltipRect.width + offset,
      left: availableLeft >= tooltipRect.width + offset,
      top: availableTop >= tooltipRect.height + offset,
      bottom: availableBottom >= tooltipRect.height + offset,
    }

    const spaceBySide: Record<TooltipSide, number> = {
      right: availableRight,
      left: availableLeft,
      top: availableTop,
      bottom: availableBottom,
    }

    let nextSide: TooltipSide = side
    if (!fitsBySide[nextSide]) {
      const rankedSides = (Object.entries(spaceBySide) as Array<[TooltipSide, number]>).sort(
        (a, b) => b[1] - a[1]
      )
      nextSide = rankedSides[0]?.[0] ?? 'bottom'
    }

    let unclampedLeft = 0
    let unclampedTop = 0

    if (nextSide === 'right') {
      unclampedLeft = triggerRect.right + offset
      unclampedTop = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
      setResolvedInlineAlign('center')
    } else if (nextSide === 'left') {
      unclampedLeft = triggerRect.left - tooltipRect.width - offset
      unclampedTop = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
      setResolvedInlineAlign('center')
    } else if (nextSide === 'top') {
      const startLeft = triggerRect.left
      const endLeft = triggerRect.right - tooltipRect.width
      const startFits =
        startLeft >= viewportPadding &&
        startLeft + tooltipRect.width <= window.innerWidth - viewportPadding
      const endFits =
        endLeft >= viewportPadding &&
        endLeft + tooltipRect.width <= window.innerWidth - viewportPadding

      if (startFits || (!startFits && !endFits && availableRight >= availableLeft)) {
        unclampedLeft = startLeft
        setResolvedInlineAlign('start')
      } else {
        unclampedLeft = endLeft
        setResolvedInlineAlign('end')
      }

      unclampedTop = triggerRect.top - tooltipRect.height - offset
    } else {
      const startLeft = triggerRect.left
      const endLeft = triggerRect.right - tooltipRect.width
      const startFits =
        startLeft >= viewportPadding &&
        startLeft + tooltipRect.width <= window.innerWidth - viewportPadding
      const endFits =
        endLeft >= viewportPadding &&
        endLeft + tooltipRect.width <= window.innerWidth - viewportPadding

      if (startFits || (!startFits && !endFits && availableRight >= availableLeft)) {
        unclampedLeft = startLeft
        setResolvedInlineAlign('start')
      } else {
        unclampedLeft = endLeft
        setResolvedInlineAlign('end')
      }

      unclampedTop = triggerRect.bottom + offset
    }

    const left = Math.min(
      Math.max(unclampedLeft, viewportPadding),
      window.innerWidth - tooltipRect.width - viewportPadding
    )

    const top = Math.min(
      Math.max(unclampedTop, viewportPadding),
      window.innerHeight - tooltipRect.height - viewportPadding
    )

    setResolvedSide(nextSide)
    setPosition({ left, top })
  }, [isOpen, offset, side])

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    return () => clearOpenTimer()
  }, [clearOpenTimer])

  useEffect(() => {
    if (!isOpen) return

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) return

    const raf = window.requestAnimationFrame(updatePosition)
    return () => window.cancelAnimationFrame(raf)
  }, [content, isOpen, updatePosition])

  const tooltipStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      zIndex: 80,
      left: position?.left ?? -9999,
      top: position?.top ?? -9999,
      pointerEvents: 'none',
    }),
    [position]
  )

  const arrowBaseStyle = useMemo<React.CSSProperties>(
    () => ({
      width: arrowSize,
      height: arrowSize,
    }),
    [arrowSize]
  )

  const arrowSideClasses = useMemo(() => {
    if (resolvedSide === 'right') {
      return 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-b'
    }

    if (resolvedSide === 'left') {
      return 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-r border-t'
    }

    if (resolvedSide === 'top') {
      if (resolvedInlineAlign === 'start') {
        return 'bottom-0 left-4 translate-y-1/2 border-r border-b'
      }
      if (resolvedInlineAlign === 'end') {
        return 'bottom-0 right-4 translate-y-1/2 border-r border-b'
      }
      return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b'
    }

    if (resolvedInlineAlign === 'start') {
      return 'top-0 left-4 -translate-y-1/2 border-l border-t'
    }
    if (resolvedInlineAlign === 'end') {
      return 'top-0 right-4 -translate-y-1/2 border-l border-t'
    }
    return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t'
  }, [resolvedInlineAlign, resolvedSide])

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={openWithDelay}
        onMouseLeave={closeNow}
        onFocus={openWithDelay}
        onBlur={closeNow}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            closeNow()
          }
        }}
      >
        {children}
      </span>

      {mounted && isOpen && !disabled &&
        createPortal(
          <div style={tooltipStyle} role="tooltip" aria-hidden={!isOpen}>
            <div
              ref={tooltipRef}
              className={cn(
                'relative w-max  whitespace-normal rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-xl',
                className
              )}
            >
              {showArrow && (
                <span
                  style={arrowBaseStyle}
                  className={cn(
                    'absolute rotate-45 bg-background border-border',
                    arrowSideClasses,
                    arrowClassName
                  )}
                />
              )}
              {content}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
