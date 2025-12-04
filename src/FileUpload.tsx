import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X } from 'lucide-react'
import { cn } from './utils'

export interface CameraCaptureProps {
  onCapture: (file: File) => void
  onRemove?: () => void
  preview?: string
  label?: string
  disabled?: boolean
  className?: string
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onRemove,
  preview,
  label = 'Take Photo',
  disabled,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onCapture(file)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block mb-2 text-sm font-medium text-neutral-700">{label}</label>}
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-neutral-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-2 bg-error text-white rounded-full shadow-lg hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <motion.button
          type="button"
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={cn(
            'w-full h-48 rounded-lg border-2 border-dashed border-neutral-300',
            'flex flex-col items-center justify-center gap-3',
            'bg-neutral-50 hover:bg-neutral-100 hover:border-primary-400',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <div className="p-4 rounded-full bg-primary-100">
            <Camera className="w-8 h-8 text-primary-700" />
          </div>
          <div className="text-center">
            <p className="font-medium text-neutral-900">Tap to capture photo</p>
            <p className="text-sm text-neutral-500 mt-1">or upload from gallery</p>
          </div>
        </motion.button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

export interface FileUploaderProps {
  onUpload: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  disabled?: boolean
  className?: string
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  accept = '*/*',
  multiple = false,
  label = 'Upload Files',
  disabled,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (files) {
      onUpload(Array.from(files))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block mb-2 text-sm font-medium text-neutral-700">{label}</label>}
      
      <motion.div
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onDragOver={(e) => {
          e.preventDefault()
          !disabled && setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          'w-full p-8 rounded-lg border-2 border-dashed',
          'flex flex-col items-center justify-center gap-3',
          'transition-all duration-200 cursor-pointer',
          isDragging && 'border-primary-500 bg-primary-50',
          !isDragging && 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-primary-400',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <div className="p-4 rounded-full bg-primary-100">
          <Upload className="w-8 h-8 text-primary-700" />
        </div>
        <div className="text-center">
          <p className="font-medium text-neutral-900">
            {isDragging ? 'Drop files here' : 'Tap to upload'}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            {multiple ? 'Select one or more files' : 'Select a file'}
          </p>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
