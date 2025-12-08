import React from 'react'

export interface CreditBarProps {
  /**
   * The text to display (e.g., "Built by StackLoop")
   */
  text?: string
  /**
   * Show heart emoji
   * @default true
   */
  showHeart?: boolean
  /**
   * Optional link URL
   */
  href?: string
  /**
   * Position of the credit bar
   * @default 'fixed'
   */
  position?: 'fixed' | 'relative' | 'sticky'
  /**
   * Background color
   * @default 'bg-gray-900'
   */
  backgroundColor?: string
  /**
   * Text color
   * @default 'text-gray-400'
   */
  textColor?: string
  /**
   * Custom className for additional styling
   */
  className?: string
}

export const CreditBar: React.FC<CreditBarProps> = ({
  text = 'Built by StackLoop',
  showHeart = true,
  href,
  position = 'fixed',
  backgroundColor = 'bg-gray-900',
  textColor = 'text-gray-400',
  className = '',
}) => {
  const displayText = showHeart ? (
    <>
      Built with <span className="text-red-500 mx-1">❤️</span> by {text.replace(/^Built by /, '')}
    </>
  ) : (
    text
  )

  const content = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${textColor} hover:text-white transition-colors duration-200 text-sm`}
    >
      {displayText}
    </a>
  ) : (
    <span className={`${textColor} text-sm`}>{displayText}</span>
  )

  return (
    <div
      className={`${position} bottom-0 left-0 right-0 ${backgroundColor} ${className}`}
      style={{ zIndex: 40 }}
    >
      <div className="flex items-center justify-center py-2 px-4">
        {content}
      </div>
    </div>
  )
}
