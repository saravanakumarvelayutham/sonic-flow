'use client'

import React from 'react'
import Image from 'next/image'
import { Play, Heart } from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  album?: string
  duration?: number
  imageUrl?: string
}

interface SongCardProps {
  song: Song
  onPlay?: (id: string) => void
  onLike?: (id: string) => void
  isLiked?: boolean
}

export function SongCard({ song, onPlay, onLike, isLiked = false }: SongCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
      {/* Album artwork placeholder */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br from-gray-200 to-gray-300">
        {song.imageUrl ? (
          <Image
            src={song.imageUrl}
            alt={song.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}

        {/* Play button overlay */}
        <button
          onClick={() => onPlay?.(song.id)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Play className="h-12 w-12 fill-white text-white" />
        </button>
      </div>

      {/* Song info */}
      <div className="min-h-12">
        <h3 className="line-clamp-2 font-semibold text-gray-900">{song.title}</h3>
        <p className="line-clamp-1 text-sm text-gray-500">{song.artist}</p>
      </div>

      {/* Like button */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {song.duration ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}` : ''}
        </span>
        <button
          onClick={() => onLike?.(song.id)}
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <Heart
            size={18}
            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
    </div>
  )
}
