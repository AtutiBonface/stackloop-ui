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
        <div className="relative flex items-center justify-between mb-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <React.Fragment key={index}>
                {/* Step Circle */}
                <div className="flex flex-col items-center relative z-10">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted || isCurrent ? '#2e7d32' : '#e5e5e5'
                    }}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      'font-semibold text-sm transition-all duration-300',
                      (isCompleted || isCurrent) && 'text-white shadow-md',
                      isUpcoming && 'text-neutral-500'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.div>
                  
                  <div className="mt-2 text-center">
                    <span
                      className={cn(
                        'text-xs font-medium',
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
                          'text-[10px] mt-0.5',
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

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-neutral-200 mx-2 relative -mt-8">
                    <motion.div
                      initial={false}
                      animate={{
                        width: index < currentStep ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-primary-600"
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Mobile View - Compact with Dots */}
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

        {/* Current Step Title */}
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
          {currentStepData?.description && (
            <p className="text-xs text-neutral-500 mt-1">
              {currentStepData.description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
