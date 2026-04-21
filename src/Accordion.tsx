'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from './utils'

export interface AccordionItemProps {
  id: string
  title: string | React.ReactNode
  content: string | React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItemProps[]
  variant?: 'default' | 'bordered'
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
  onChange?: (openItems: string[]) => void
  animate?: boolean
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  variant = 'default',
  allowMultiple = false,
  defaultOpen = [],
  className,
  onChange,
  animate = true
}) => {
  const shouldAnimate = animate !== false
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (id: string) => {
    let newOpenItems: string[]
    
    if (allowMultiple) {
      newOpenItems = openItems.includes(id)
        ? openItems.filter(item => item !== id)
        : [...openItems, id]
    } else {
      newOpenItems = openItems.includes(id) ? [] : [id]
    }

    setOpenItems(newOpenItems)
    onChange?.(newOpenItems)
  }

  const variantStyles = {
    default: 'border-t border-border',
    bordered: 'border border-border rounded-none'
  }

  return (
    <div className={cn('w-full', className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            variantStyles[variant],
            index === items.length - 1 && variant === 'default' && 'border-b border-border'
          )}
        >
          <motion.button
            onClick={() => !item.disabled && toggleItem(item.id)}
            disabled={item.disabled}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'disabled:hover:bg-transparent'
            )}
            whileHover={!item.disabled && shouldAnimate ? { backgroundColor: 'var(--color-secondary)' } : {}}
            whileTap={!item.disabled && shouldAnimate ? { scale: 0.99 } : {}}
          >
            <div className="flex items-center gap-3 flex-1">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="text-foreground font-medium">
                {item.title}
              </span>
            </div>
            <motion.div
              animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
              transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
              className="shrink-0 ml-2"
            >
              <ChevronDown className="w-5 h-5 text-foreground/60" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openItems.includes(item.id) && (
              <motion.div
                initial={shouldAnimate ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={shouldAnimate ? { height: 0, opacity: 0 } : { height: 0, opacity: 1 }}
                transition={shouldAnimate ? { duration: 0.3, ease: 'easeInOut' } : { duration: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-secondary/40 text-foreground text-sm leading-relaxed">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
