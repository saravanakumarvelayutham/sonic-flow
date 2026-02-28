// Type definitions for SonicFlow

export type SongSource = 'spotify' | 'apple' | 'youtube' | 'amazon' | 'seed' | 'recommendation'

export type MusicStyle = 'minimal' | 'feature-rich' | 'mixed'
export type MusicMood = 'focused' | 'relaxed' | 'energetic' | 'playful'
export type WeeklyPrompt = 'weekly' | 'daily' | 'none' | 'workout' | 'focus'

export interface BaseSong {
  id: string
  title: string
  artist: string
  album: string
  duration: number
}

export interface SpotifySong extends BaseSong {
  source: 'spotify'
  cover: string
  previewUrl: string
}

export interface SpotifyExtendedSong extends SpotifySong {
  genre: string
  releaseDate: string
}

export interface AppleMusicSong extends BaseSong {
  source: 'apple'
  cover: string
  previewUrl: string
  genre: string
  releaseDate: string
}

export interface YouTubeSong extends BaseSong {
  source: 'youtube'
  cover: string
  previewUrl: string
  playCount: number
}

export interface AmazonSong extends BaseSong {
  source: 'amazon'
  cover: string
  previewUrl: string
  genre: string
  releaseDate: string
}

export type Song = SpotifySong | AppleMusicSong | YouTubeSong | AmazonSong

export interface UserPreferences {
  style: MusicStyle
  mood: MusicMood
  weeklyPrompt: WeeklyPrompt
  genres: string[]
}

export interface Session {
  id: string
  accessToken: string
  user: {
    id: string
    email: string
    name: string
    picture?: string
    provider: 'spotify' | 'apple' | 'youtube' | 'amazon'
  }
  preferences: UserPreferences
  connectedAccounts: {
    apple?: boolean
    youtube?: boolean
    amazon?: boolean
  }
  createdAt: string
  updatedAt: string
  expiresAt: string
  welcomeStep: number
}

export interface WelcomeSection {
  id: string
  title: string
  description: string
  emoji: string
  substeps?: {
    id: number
    text: string
    emoji: string
  }[]
}

export interface SongRecommendation {
  song: Song
  reason: string
  matchScore: number
  tags: string[]
}