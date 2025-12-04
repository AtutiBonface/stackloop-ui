import React from 'react'
import { motion } from 'framer-motion'
import { X, FileText, Image as ImageIcon } from 'lucide-react'
import { cn } from './utils'

export interface ThumbnailItem {
  id: string
  name: string
  url: string
  type: 'image' | 'document' | 'audio'
  size?: number
}

export interface ThumbnailGridProps {
  items: ThumbnailItem[]
  onRemove?: (id: string) => void
  onView?: (item: ThumbnailItem) => void
  columns?: 2 | 3 | 4
  className?: string
}

export const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({
  items,
  onRemove,
  onView,
  columns = 3,
  className
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ''
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  const getIcon = (type: ThumbnailItem['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-8 h-8 text-primary-600" />
      case 'audio':
        return <FileText className="w-8 h-8 text-primary-600" />
      default:
        return <ImageIcon className="w-8 h-8 text-primary-600" />
    }
  }

  if (items.length === 0) return null

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('grid gap-3', gridCols[columns])}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative group"
          >
            <div
              onClick={() => onView?.(item)}
              className={cn(
                'aspect-square rounded-lg overflow-hidden border-2 border-neutral-200',
                'flex items-center justify-center',
                'cursor-pointer hover:border-primary-400 transition-all',
                item.type === 'image' ? 'bg-neutral-100' : 'bg-neutral-50'
              )}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-3">
                  {getIcon(item.type)}
                  <p className="text-xs text-center text-neutral-700 line-clamp-2">
                    {item.name}
                  </p>
                </div>
              )}
            </div>

            {/* Remove Button */}
            {onRemove && (
              <motion.button
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -top-2 -right-2 p-1.5 bg-error text-white rounded-full shadow-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(item.id)
                }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}

            {/* File Info */}
            {item.size && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 backdrop-blur-sm">
                <p className="truncate">{item.name}</p>
                <p className="text-neutral-300">{formatSize(item.size)}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
