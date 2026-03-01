import React from 'react'

interface AudioWaveformProps {
  isPlaying?: boolean
  variant?: 'default' | 'compact'
}

export function AudioWaveform({ isPlaying = false, variant = 'default' }: AudioWaveformProps) {
  const compactHeights = [4, 7, 6, 9, 5, 8, 6, 10, 5, 7, 6, 8]
  const defaultHeights = [8, 16, 12, 20, 10, 18, 14, 22, 11, 17, 13, 19]
  const heights = variant === 'compact' ? compactHeights : defaultHeights

  return (
    <div className={`flex items-center justify-center gap-1 ${variant === 'compact' ? 'h-4' : 'h-8'}`}>
      {heights.map((height, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-top from-blue-400 to-blue-600 rounded-sm transition-all ${
            isPlaying ? 'animate-pulse' : ''
          }`}
          style={{
            height: `${height}px`,
          }}
        />
      ))}
    </div>
  )
}
