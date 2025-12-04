import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from './utils'

export interface Step {
  label: string
  description?: string
}

export interface StepProgressProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  className
}) => {
  const currentStepData = steps[currentStep]

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop View - Horizontal Steps */}
      <div className="hidden md:block">
        <div className="relative flex items-center mb-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <React.Fragment key={index}>
                {/* Step Circle and Label */}
                <div className="flex flex-col items-center relative z-10">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.05 : 1,
                      backgroundColor: isCompleted || isCurrent ? '#2e7d32' : '#e5e5e5'
                    }}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      'font-semibold text-base transition-all duration-300',
                      (isCompleted || isCurrent) && 'text-white shadow-lg',
                      isUpcoming && 'text-neutral-500',
                      'ring-4 ring-white'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.div>
                  
                  <div className="mt-3 text-center max-w-[120px]">
                    <span
                      className={cn(
                        'text-sm font-semibold block',
                        isCurrent && 'text-primary-700',
                        isCompleted && 'text-neutral-700',
                        isUpcoming && 'text-neutral-400'
                      )}
                    >
                      {step.label}
                    </span>
                    {step.description && (
                      <p
                        className={cn(
                          'text-xs mt-1 leading-tight',
                          isCurrent && 'text-primary-600',
                          isCompleted && 'text-neutral-500',
                          isUpcoming && 'text-neutral-400'
                        )}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line - Thicker with rounded ends */}
                {index < steps.length - 1 && (
                  <div className="flex-1 relative" style={{ marginTop: '-48px', marginLeft: '4px', marginRight: '4px' }}>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{
                          width: index < currentStep ? '100%' : '0%'
                        }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="h-full bg-primary-600 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Mobile View - Compact with Dots (Description Hidden) */}
      <div className="md:hidden">
        {/* Step Dots at Top */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {steps.map((_, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted || isCurrent ? '#2e7d32' : '#d4d4d4'
                }}
                className={cn(
                  'rounded-full transition-all duration-300',
                  isCurrent ? 'w-3 h-3' : 'w-2 h-2',
                  (isCompleted || isCurrent) && 'shadow-sm'
                )}
              />
            )
          })}
        </div>

        {/* Current Step Title Only (No Description) */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-neutral-900">
            {currentStepData?.label}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
