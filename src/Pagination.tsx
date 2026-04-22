'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, House } from 'lucide-react'
import { Button } from './Button'
import { cn } from './utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
  className?: string
  animate?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
  animate = true
}) => {
  const shouldAnimate = animate !== false
  const pageItems = React.useMemo(() => {
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, currentPage - half)
    let end = start + maxVisible - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  const goToPage = (page: number) => {
    const nextPage = Math.max(1, Math.min(totalPages, page))
    if (nextPage !== currentPage) {
      onPageChange(nextPage)
    }
  }

  return (
    <motion.div
      {...(shouldAnimate
        ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }
        : {})}
      className={cn('flex items-center justify-between gap-4 flex-wrap', className)}
    >
      <div className="text-sm text-foreground/70">
        {totalItems && itemsPerPage && (
          <span>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          icon={<ChevronLeft className="w-4 h-4" />}
          animate={animate}
        >
          Previous
        </Button>
        {!pageItems.includes(1) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => goToPage(1)}
            icon={<House className="w-4 h-4 text-primary" />}
            animate={animate}
            aria-label="Go to first page"
          />
        )}
        <motion.div layout className="flex items-center justify-center gap-1">
          <AnimatePresence initial={false} mode="popLayout">
            {pageItems.map((item) => {
              const isActive = item === currentPage

              return (
                <motion.button
                  key={item}
                  layout
                  whileHover={shouldAnimate ? { y: -1 } : undefined}
                  whileTap={shouldAnimate ? { scale: 0.96 } : undefined}
                  onClick={() => goToPage(item)}
                  className={cn(
                    'w-10 h-10 rounded-md border text-sm font-medium tabular-nums leading-none inline-flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'hover:bg-secondary border-border text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </motion.div>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          icon={<ChevronRight className="w-4 h-4" />}
          animate={animate}
        >
          Next
        </Button>
      </div>
    </motion.div>
  )
}
