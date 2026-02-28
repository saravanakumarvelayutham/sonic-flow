import React from 'react'

interface AudioWaveformProps {
  isPlaying?: boolean
  variant?: 'default' | 'compact'
}

export function AudioWaveform({ isPlaying = false, variant = 'default' }: AudioWaveformProps) {
  return (
    <div className={`flex items-center justify-center gap-1 ${variant === 'compact' ? 'h-4' : 'h-8'}`}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-top from-blue-400 to-blue-600 rounded-sm transition-all ${
            isPlaying ? 'animate-pulse' : ''
          }`}
          style={{
            height: `${Math.random() * (variant === 'compact' ? 8 : 20) + 4}px`,
          }}
        />
      ))}
    </div>
  )
}
