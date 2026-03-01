'use server'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AppleMusicSong, YouTubeSong, AmazonSong } from '@/types'

interface AppleSongItem {
  id: string
  attributes: {
    name?: string
    artistName?: string
    albumName?: string
    artwork?: { url?: string }
    durationInMillis?: number
    previewUrl?: string
    releaseDate?: string
    genreNames?: string[]
  }
}

interface YouTubePlaylistItem {
  id?: string
}

interface YouTubePlaylistSongItem {
  snippet?: {
    title?: string
    description?: string
    position?: number
    resourceId?: {
      videoId?: string
    }
  }
}

interface AmazonTrackItem {
  id?: string
  trackTitle?: string
  artistName?: string
  albumName?: string
  coverArt?: string
  trackPublishingDateTime?: string
  previewUrl?: string
  genreName?: string
}

async function fetchAppleMusicLibrary(accessToken: string) {
  // Apple Music API integration
  const response = await fetch('https://api.music.apple.com/v1/me/library/songs', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  const data = (await response.json()) as { data?: AppleSongItem[] }

  return (data.data || []).map((song) => ({
    id: `apple_${song.id}`,
    title: song.attributes.name || 'Unknown',
    artist: song.attributes.artistName || 'Unknown',
    album: song.attributes.albumName || 'Unknown',
    cover: song.attributes.artwork?.url || '',
    duration: (song.attributes.durationInMillis || 0) / 1000,
    previewUrl: song.attributes.previewUrl || '',
    source: 'apple' as const,
    releaseDate: song.attributes.releaseDate || '',
    genre: song.attributes.genreNames?.[0] || 'Unknown',
  }))
}

async function fetchYouTubeLibrary(accessToken: string) {
  // YouTube Music Library API integration
  const response = await fetch('https://www.googleapis.com/youtube/v3/playlists?mine=true&part=snippet', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  const data = (await response.json()) as { items?: YouTubePlaylistItem[] }

  const songs: YouTubeSong[] = []
  for (const item of data.items || []) {
    if (!item.id) {
      continue
    }

    const songsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${item.id}&part=snippet&maxResults=100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    const songsData = (await songsResponse.json()) as { items?: YouTubePlaylistSongItem[] }
    songsData.items?.forEach((playlistItem) => {
      const video = playlistItem.snippet?.resourceId?.videoId
      if (!video) {
        return
      }

      songs.push({
        id: `youtube_${video}`,
        title: playlistItem.snippet?.title || 'Unknown',
        artist: playlistItem.snippet?.description?.split(' artist: ')[1] || 'Unknown',
        album: 'YouTube',
        cover: `https://img.youtube.com/vi/${video}/hqdefault.jpg`,
        duration: 0, // YouTube doesn't return duration in playlist endpoints easily
        previewUrl: `https://www.youtube.com/watch?v=${video}`,
        source: 'youtube' as const,
        playCount: (playlistItem.snippet?.position || 0) + 1,
      })
    })
  }

  return songs
}

async function fetchAmazonMusicLibrary(accessToken: string) {
  // Amazon Music API integration
  const response = await fetch('https://api.music.amazon.com/v1/stations', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  const data = (await response.json()) as { items?: AmazonTrackItem[] }

  return (data.items || []).map((song) => ({
    id: `amazon_${song.id}`,
    title: song.trackTitle || 'Unknown',
    artist: song.artistName || 'Unknown',
    album: song.albumName || 'Unknown',
    cover: song.coverArt || '',
    duration: 0,
    previewUrl: song.previewUrl || '',
    source: 'amazon' as const,
    releaseDate: song.trackPublishingDateTime || '',
    genre: song.genreName || 'Unknown',
  }))
}

export async function POST() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('sonicflow_session')?.value

    if (!session) {
      return NextResponse.json(
        { error: 'No authenticated session' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(session)
    const songs: Array<AppleMusicSong | YouTubeSong | AmazonSong> = []

    // Fetch from all connected providers
    if (sessionData.user?.provider === 'apple') {
      try {
        const appleSongs = await fetchAppleMusicLibrary(sessionData.accessToken!)
        songs.push(...appleSongs)
      } catch (error) {
        console.error('Failed to fetch Apple Music:', error)
      }
    }

    if (sessionData.user?.provider === 'youtube') {
      try {
        const youtubeSongs = await fetchYouTubeLibrary(sessionData.accessToken!)
        songs.push(...youtubeSongs)
      } catch (error) {
        console.error('Failed to fetch YouTube Music:', error)
      }
    }

    if (sessionData.user?.provider === 'amazon') {
      try {
        const amazonSongs = await fetchAmazonMusicLibrary(sessionData.accessToken!)
        songs.push(...amazonSongs)
      } catch (error) {
        console.error('Failed to fetch Amazon Music:', error)
      }
    }

    return NextResponse.json({
      success: true,
      songs,
      count: songs.length,
      providers: sessionData.user?.provider,
    })
  } catch (error) {
    console.error('Sync songs error:', error)
    return NextResponse.json(
      { error: 'Failed to sync songs' },
      { status: 500 }
    )
  }
}