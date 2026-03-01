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
    <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/95 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="low-bandwidth-hide pointer-events-none absolute inset-x-0 -top-12 h-20 bg-gradient-to-r from-pink-200/60 via-purple-200/60 to-indigo-200/60 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Album artwork placeholder */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br from-gray-200 to-gray-300">
        {song.imageUrl ? (
          <Image
            src={song.imageUrl}
            alt={song.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Play className="h-12 w-12 fill-white text-white transition-transform duration-300 group-hover:scale-110" />
        </button>

        <div className="low-bandwidth-hide pointer-events-none absolute bottom-2 left-2 flex h-5 items-end gap-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="sonic-eq-bar h-2 w-1 rounded-sm bg-white/90" style={{ animationDelay: '0s' }} />
          <span className="sonic-eq-bar h-3 w-1 rounded-sm bg-white/90" style={{ animationDelay: '0.12s' }} />
          <span className="sonic-eq-bar h-4 w-1 rounded-sm bg-white/90" style={{ animationDelay: '0.2s' }} />
          <span className="sonic-eq-bar h-2 w-1 rounded-sm bg-white/90" style={{ animationDelay: '0.28s' }} />
        </div>
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
          className="rounded-full p-2 hover:bg-gray-100 transition-all duration-300 hover:scale-110"
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
