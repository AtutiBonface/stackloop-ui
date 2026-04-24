'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from './utils'

type RootVerticalPlacement = 'auto' | 'top' | 'bottom'
type RootHorizontalPlacement = 'auto' | 'left' | 'right'
type SubmenuHorizontalPlacement = 'auto' | 'left' | 'right'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  placement: 'top' | 'bottom'
  preferredPlacement: RootVerticalPlacement
  closeAll: () => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

interface DropdownSubmenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  placement: 'left' | 'right'
  preferredPlacement: SubmenuHorizontalPlacement
}

const DropdownSubmenuContext = createContext<DropdownSubmenuContextValue | null>(null)

const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenu components must be used inside <DropdownMenu>.')
  }
  return context
}

const useDropdownSubmenuContext = () => {
  const context = useContext(DropdownSubmenuContext)
  if (!context) {
    throw new Error('DropdownMenuSub components must be used inside <DropdownMenuSub>.')
  }
  return context
}

const composeRefs = <T,>(...refs: Array<React.Ref<T> | undefined>) => {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(node)
        return
      }
      ;(ref as React.MutableRefObject<T | null>).current = node
    })
  }
}

interface TriggerElementProps {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
}

const getElementProps = (element: React.ReactElement<any>): TriggerElementProps => {
  return element.props as TriggerElementProps
}

export interface DropdownMenuProps {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: RootVerticalPlacement
  className?: string
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'auto',
  className
}) => {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [resolvedPlacement, setResolvedPlacement] = useState<'top' | 'bottom'>('bottom')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const isOpen = isControlled ? Boolean(open) : internalOpen

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const closeAll = () => setOpen(false)

  useEffect(() => {
    if (!isOpen) return

    const handleOutsidePointer = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      if (contentRef.current?.contains(event.target as Node)) return
      closeAll()
    }

    document.addEventListener('mousedown', handleOutsidePointer)
    return () => {
      document.removeEventListener('mousedown', handleOutsidePointer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const updatePlacement = () => {
      if (!triggerRef.current) return

      if (placement === 'top') {
        setResolvedPlacement('top')
        return
      }

      if (placement === 'bottom') {
        setResolvedPlacement('bottom')
        return
      }

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const menuHeight = contentRef.current?.offsetHeight ?? 240
      const availableBottom = window.innerHeight - triggerRect.bottom - 8
      const availableTop = triggerRect.top - 8

      if (availableBottom >= menuHeight || availableBottom >= availableTop) {
        setResolvedPlacement('bottom')
        return
      }

      setResolvedPlacement('top')
    }

    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)

    return () => {
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement, true)
    }
  }, [isOpen, placement])

  const contextValue = useMemo<DropdownMenuContextValue>(() => ({
    open: isOpen,
    setOpen,
    toggle: () => setOpen(!isOpen),
    triggerRef,
    contentRef,
    placement: resolvedPlacement,
    preferredPlacement: placement,
    closeAll
  }), [isOpen, resolvedPlacement, placement])

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div ref={rootRef} className={cn('relative inline-flex', className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

export const DropdownMenuTrigger = React.forwardRef<HTMLElement, DropdownMenuTriggerProps>(
  ({ asChild = false, className, children, onClick, onKeyDown, ...props }, forwardedRef) => {
    const { open, toggle, triggerRef } = useDropdownMenuContext()

    const attachRef = composeRefs(forwardedRef, (node: HTMLElement | null) => {
      triggerRef.current = node
    })

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>
      const childProps = getElementProps(child)

      return React.cloneElement(child, {
        ref: composeRefs((child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref, attachRef),
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          childProps.onClick?.(event)
          onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>)
          if (!event.defaultPrevented) {
            toggle()
          }
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          childProps.onKeyDown?.(event)
          onKeyDown?.(event as unknown as React.KeyboardEvent<HTMLButtonElement>)
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
          }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'data-state': open ? 'open' : 'closed'
      } as any)
    }

    return (
      <button
        ref={attachRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            toggle()
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground',
          'transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export interface DropdownMenuContentProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  align?: 'start' | 'end'
  side?: RootHorizontalPlacement
  sideOffset?: number
  animate?: boolean
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  align = 'start',
  side = 'auto',
  sideOffset = 8,
  animate = true,
  ...props
}) => {
  const { open, setOpen, contentRef, placement, triggerRef } = useDropdownMenuContext()
  const [resolvedHorizontalSide, setResolvedHorizontalSide] = useState<'left' | 'right'>(
    align === 'end' ? 'left' : 'right'
  )

  useEffect(() => {
    if (!open) return

    const updateHorizontalPlacement = () => {
      if (!triggerRef.current) return

      if (side === 'left') {
        setResolvedHorizontalSide('left')
        return
      }

      if (side === 'right') {
        setResolvedHorizontalSide('right')
        return
      }

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const menuWidth = contentRef.current?.offsetWidth ?? 224
      const viewportPadding = 8
      const availableRight = window.innerWidth - triggerRect.left - viewportPadding
      const availableLeft = triggerRect.right - viewportPadding
      const preferredSide: 'left' | 'right' = align === 'end' ? 'left' : 'right'
      const fallbackSide: 'left' | 'right' = preferredSide === 'right' ? 'left' : 'right'
      const preferredSpace = preferredSide === 'right' ? availableRight : availableLeft
      const fallbackSpace = fallbackSide === 'right' ? availableRight : availableLeft

      if (preferredSpace >= menuWidth) {
        setResolvedHorizontalSide(preferredSide)
        return
      }

      if (fallbackSpace >= menuWidth) {
        setResolvedHorizontalSide(fallbackSide)
        return
      }

      setResolvedHorizontalSide(preferredSpace >= fallbackSpace ? preferredSide : fallbackSide)
    }

    updateHorizontalPlacement()
    window.addEventListener('resize', updateHorizontalPlacement)
    window.addEventListener('scroll', updateHorizontalPlacement, true)

    return () => {
      window.removeEventListener('resize', updateHorizontalPlacement)
      window.removeEventListener('scroll', updateHorizontalPlacement, true)
    }
  }, [open, side, align, triggerRef, contentRef])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={contentRef}
          role="menu"
          initial={animate ? { opacity: 0, y: placement === 'bottom' ? -6 : 6 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          exit={animate ? { opacity: 0, y: placement === 'bottom' ? -6 : 6 } : undefined}
          transition={{ duration: 0.16 }}
          className={cn(
            'absolute z-50 min-w-56 rounded-md border border-border bg-background p-1 shadow-lg',
            placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
            resolvedHorizontalSide === 'right' ? 'left-0' : 'right-0',
            className
          )}
          style={{
            marginTop: placement === 'bottom' ? sideOffset : undefined,
            marginBottom: placement === 'top' ? sideOffset : undefined,
            maxWidth: 'calc(100vw - 16px)'
          }}
          {...props}
          onKeyDown={(event) => {
            props.onKeyDown?.(event)
            if (event.key === 'Escape') {
              event.preventDefault()
              setOpen(false)
            }
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  asChild?: boolean
  disabled?: boolean
  closeOnSelect?: boolean
}

export const DropdownMenuItem = React.forwardRef<HTMLElement, DropdownMenuItemProps>(
  ({ children, asChild = false, disabled = false, closeOnSelect = true, className, onClick, ...props }, forwardedRef) => {
    const { closeAll } = useDropdownMenuContext()

    const handleSelect = (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault()
        return
      }

      onClick?.(event as unknown as React.MouseEvent<HTMLElement>)
      if (!event.defaultPrevented && closeOnSelect) {
        closeAll()
      }
    }

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>
      const childProps = getElementProps(child)

      return React.cloneElement(child, {
        ref: composeRefs((child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref, forwardedRef),
        role: 'menuitem',
        'aria-disabled': disabled,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          childProps.onClick?.(event)
          handleSelect(event)
        },
        className: cn(
          'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground transition-colors',
          !disabled && 'cursor-pointer hover:bg-secondary',
          disabled && 'cursor-not-allowed text-foreground/45',
          (child.props as { className?: string }).className,
          className
        )
      } as any)
    }

    return (
      <button
        ref={forwardedRef as React.Ref<HTMLButtonElement>}
        type="button"
        role="menuitem"
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleSelect as React.MouseEventHandler<HTMLButtonElement>}
        className={cn(
          'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors',
          !disabled && 'cursor-pointer hover:bg-secondary',
          disabled && 'cursor-not-allowed text-foreground/45',
          className
        )}
        {...(props as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>)}
      >
        {children}
      </button>
    )
  }
)

DropdownMenuItem.displayName = 'DropdownMenuItem'

export interface DropdownMenuSubProps {
  children: React.ReactNode
  defaultOpen?: boolean
  placement?: SubmenuHorizontalPlacement
}

export const DropdownMenuSub: React.FC<DropdownMenuSubProps> = ({
  children,
  defaultOpen = false,
  placement = 'auto'
}) => {
  const parentSubmenu = useContext(DropdownSubmenuContext)
  const [open, setOpen] = useState(defaultOpen)
  const [resolvedPlacement, setResolvedPlacement] = useState<'left' | 'right'>('right')
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const updatePlacement = () => {
      if (!triggerRef.current) return

      if (placement === 'left') {
        setResolvedPlacement('left')
        return
      }

      if (placement === 'right') {
        setResolvedPlacement('right')
        return
      }

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const submenuWidth = contentRef.current?.offsetWidth ?? 220
      const availableRight = window.innerWidth - triggerRect.right - 8
      const availableLeft = triggerRect.left - 8
      const inheritedPreferredSide = parentSubmenu?.placement ?? 'right'
      const preferredSide = placement === 'auto' ? inheritedPreferredSide : placement
      const preferredSpace = preferredSide === 'right' ? availableRight : availableLeft
      const fallbackSide: 'left' | 'right' = preferredSide === 'right' ? 'left' : 'right'
      const fallbackSpace = fallbackSide === 'right' ? availableRight : availableLeft

      if (preferredSpace >= submenuWidth) {
        setResolvedPlacement(preferredSide)
        return
      }

      if (fallbackSpace >= submenuWidth) {
        setResolvedPlacement(fallbackSide)
        return
      }

      setResolvedPlacement(preferredSpace >= fallbackSpace ? preferredSide : fallbackSide)
      return
    }

    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)

    return () => {
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement, true)
    }
  }, [open, placement, parentSubmenu?.placement])

  const contextValue = useMemo<DropdownSubmenuContextValue>(() => ({
    open,
    setOpen,
    toggle: () => setOpen(!open),
    triggerRef,
    contentRef,
    placement: resolvedPlacement,
    preferredPlacement: placement
  }), [open, resolvedPlacement, placement])

  return (
    <DropdownSubmenuContext.Provider value={contextValue}>
      <div className="relative">{children}</div>
    </DropdownSubmenuContext.Provider>
  )
}

export interface DropdownMenuSubTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

export const DropdownMenuSubTrigger = React.forwardRef<HTMLElement, DropdownMenuSubTriggerProps>(
  ({ asChild = false, className, children, onClick, ...props }, forwardedRef) => {
    const { open, toggle, triggerRef, placement } = useDropdownSubmenuContext()

    const attachRef = composeRefs(forwardedRef, (node: HTMLElement | null) => {
      triggerRef.current = node
    })

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>
      const childProps = getElementProps(child)

      return React.cloneElement(child, {
        ref: composeRefs((child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref, attachRef),
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          childProps.onClick?.(event)
          onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>)
          if (!event.defaultPrevented) {
            toggle()
          }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'data-state': open ? 'open' : 'closed'
      } as any)
    }

    return (
      <button
        ref={attachRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            toggle()
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors',
          'hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
          className
        )}
        {...props}
      >
        <span className="min-w-0 truncate">{children}</span>
        <ChevronRight className={cn('h-4 w-4 shrink-0 text-foreground/70 transition-transform', placement === 'left' && 'rotate-180')} />
      </button>
    )
  }
)

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

export interface DropdownMenuSubContentProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  sideOffset?: number
  animate?: boolean
}

export const DropdownMenuSubContent: React.FC<DropdownMenuSubContentProps> = ({
  children,
  className,
  sideOffset = 6,
  animate = true,
  ...props
}) => {
  const { open, placement, contentRef } = useDropdownSubmenuContext()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={contentRef}
          role="menu"
          initial={animate ? { opacity: 0, x: placement === 'right' ? -6 : 6 } : false}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          exit={animate ? { opacity: 0, x: placement === 'right' ? -6 : 6 } : undefined}
          transition={{ duration: 0.14 }}
          className={cn(
            'absolute top-0 z-50 min-w-52 rounded-md border border-border bg-background p-1 shadow-lg',
            placement === 'right' ? 'left-full' : 'right-full',
            className
          )}
          style={{
            marginLeft: placement === 'right' ? sideOffset : undefined,
            marginRight: placement === 'left' ? sideOffset : undefined
          }}
          {...props}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}