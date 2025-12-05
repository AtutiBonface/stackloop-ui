import React, { useRef } from 'react'
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
      {label && <label className="block mb-2 text-sm font-medium text-primary">{label}</label>}
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-border">
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
            'w-full p-4 rounded-lg border-2 border-border',
            'flex items-center justify-center gap-3',
            'bg-secondary hover:bg-border hover:border-border-dark',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Camera className="w-6 h-6 text-primary" />
          <span className="font-medium text-foreground">Capture Photo</span>
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

  const handleFiles = (files: FileList | null) => {
    if (files) {
      onUpload(Array.from(files))
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block mb-2 text-sm font-medium text-primary">{label}</label>}
      
      <motion.button
        type="button"
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        disabled={disabled}
        className={cn(
          'w-full p-4 rounded-lg border-2 border-border',
          'flex items-center justify-center gap-3',
          'bg-secondary hover:bg-border hover:border-border-dark',
          'transition-all duration-200 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Upload className="w-6 h-6 text-primary" />
        <span className="font-medium text-foreground">
          {multiple ? 'Upload Files' : 'Upload File'}
        </span>
      </motion.button>

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
