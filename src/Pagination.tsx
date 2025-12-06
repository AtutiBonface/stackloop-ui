'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { cn } from './utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const showPages = pages.slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
          onClick={() => onPageChange(currentPage - 1)}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {currentPage > 3 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(1)}
                className="w-10 h-10 rounded-md hover:bg-secondary border border-border text-sm transition-colors"
              >
                1
              </motion.button>
              <span className="text-primary/50 px-1">...</span>
            </>
          )}
          {showPages.map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-10 h-10 rounded-md text-sm border transition-all',
                page === currentPage
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'hover:bg-secondary border-border'
              )}
            >
              {page}
            </motion.button>
          ))}
          {currentPage < totalPages - 2 && (
            <>
              <span className="text-primary/50 px-1">...</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 rounded-md hover:bg-secondary border border-border text-sm transition-colors"
              >
                {totalPages}
              </motion.button>
            </>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </motion.div>
  )
}
