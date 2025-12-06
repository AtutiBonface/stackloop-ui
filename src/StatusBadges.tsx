'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'
import { cn } from './utils'

export interface OfflineBadgeProps {
  isOffline: boolean
  className?: string
}

export const OfflineBadge: React.FC<OfflineBadgeProps> = ({
  isOffline,
  className
}) => {
  if (!isOffline) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'bg-warning text-white text-sm font-medium shadow-sm',
        className
      )}
    >
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode</span>
    </motion.div>
  )
}

export interface SyncIndicatorProps {
  status: 'synced' | 'syncing' | 'unsynced' | 'error'
  count?: number
  className?: string
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  status,
  count,
  className
}) => {
  const statusConfig = {
    synced: {
      icon: <Wifi className="w-4 h-4" />,
      label: 'Synced',
      color: 'bg-success text-white'
    },
    syncing: {
      icon: <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Wifi className="w-4 h-4" /></motion.div>,
      label: 'Syncing...',
      color: 'bg-info text-white'
    },
    unsynced: {
      icon: <WifiOff className="w-4 h-4" />,
      label: count ? `${count} Unsynced` : 'Unsynced',
      color: 'bg-warning text-white'
    },
    error: {
      icon: <WifiOff className="w-4 h-4" />,
      label: 'Sync Error',
      color: 'bg-error text-white'
    }
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'text-sm font-medium shadow-sm',
        config.color,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </motion.div>
  )
}
