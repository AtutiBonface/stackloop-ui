import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mic, Square, Pause, Play, Trash2 } from 'lucide-react'
import { cn } from './utils'

export interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  label?: string
  maxDuration?: number
  disabled?: boolean
  className?: string
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  label = 'Record Audio',
  maxDuration = 300, // 5 minutes default
  disabled,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setDuration((prev) => Math.min(prev + 1, maxDuration))
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const deleteRecording = () => {
    setAudioUrl(null)
    setDuration(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block mb-2 text-sm font-medium text-neutral-700">{label}</label>}
      
      <div className="p-6 bg-white rounded-lg border-2 border-neutral-200 space-y-4">
        {/* Recording Controls */}
        {!audioUrl && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <motion.button
                type="button"
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                onClick={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
                disabled={disabled}
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isRecording
                    ? 'bg-warning text-white animate-pulse'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                )}
              >
                {isRecording ? (
                  isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </motion.button>

              {isRecording && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-error rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </div>

            <div className="text-center">
              <p className="text-2xl font-mono font-semibold text-neutral-900">
                {formatTime(duration)}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Tap to record'}
              </p>
            </div>

            {isRecording && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={stopRecording}
                className="px-6 py-2 bg-error text-white rounded-full font-medium hover:bg-red-600"
              >
                <Square className="w-4 h-4 inline mr-2" />
                Stop Recording
              </motion.button>
            )}
          </div>
        )}

        {/* Playback */}
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <audio src={audioUrl} controls className="w-full" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                Duration: {formatTime(duration)}
              </span>
              <button
                type="button"
                onClick={deleteRecording}
                className="flex items-center gap-2 px-4 py-2 text-error hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
