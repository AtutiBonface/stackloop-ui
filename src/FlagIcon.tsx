import React from 'react'
import 'flag-icons/css/flag-icons.min.css'
import { cn } from './utils'

export interface FlagIconProps {
  iso2: string
  className?: string
}

export const FlagIcon: React.FC<FlagIconProps> = ({ iso2, className }) => {
  const flagCode = iso2.trim().toLowerCase()

  return <span aria-hidden className={cn(`fi fi-${flagCode}`, 'inline-block shrink-0', className)} />
}

