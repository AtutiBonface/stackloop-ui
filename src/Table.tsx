'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import { cn } from './utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  width?: string
  truncate?: boolean // Enable text truncation with ellipsis
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  onRowClick?: (item: T) => void
  keyExtractor: (item: T) => string
  className?: string
  animate?: boolean
}

export function Table<T>({
  data,
  columns,
  loading = false,
  onRowClick,
  keyExtractor,
  className,
  animate = true
}: TableProps<T>) {
  const shouldAnimate = animate !== false
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedData = sortKey
    ? [...data].sort((a: any, b: any) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    : data

  if (loading) {
    return (
      <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {columns.map((_, idx) => (
                  <th key={idx} className="px-6 py-4 text-left">
                    <div className={cn('h-4 bg-border rounded w-24', shouldAnimate && 'animate-pulse')}></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="border-b border-border">
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div className={cn('h-4 bg-secondary rounded', shouldAnimate && 'animate-pulse')}></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      {...(shouldAnimate
        ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }
        : {})}
      className={cn('border border-border rounded-lg overflow-hidden', className)}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-semibold text-foreground',
                    col.width,
                    col.sortable && 'cursor-pointer  transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(col.key as string)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <span className="text-primary/50 hover:text-primary transition-colors">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, idx) => (
              <motion.tr
                key={keyExtractor(item)}
                {...(shouldAnimate
                  ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: idx * 0.05 } }
                  : {})}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  'border-b border-border transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-secondary'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={cn(
                      'px-6 py-4 text-sm text-foreground/70',
                      col.width
                    )}
                    style={col.width ? { width: col.width } : undefined}
                    title={col.truncate && !col.render ? String((item as any)[col.key] ?? '') : undefined}
                  >
                    {col.truncate && !col.render ? (
                      <div className="truncate">
                        {String((item as any)[col.key] ?? '')}
                      </div>
                    ) : col.render ? (
                      col.render(item)
                    ) : (
                      String((item as any)[col.key] ?? '')
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
