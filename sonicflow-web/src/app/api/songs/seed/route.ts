'use server'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Song } from '@/types'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
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

    // Generate seeded songs
    const genres = ['Pop', 'Electronic', 'Rock', 'Hip-Hop', 'Indie', 'Jazz', 'Classical', 'R&B']
    const sampleSongs: Song[] = [
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'Midnight City',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      cover: '',
      duration: 243,
      previewUrl: '',
      source: 'apple',
      genre: 'Electronic',
      releaseDate: '2011-01-01',
    },
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      cover: '',
      duration: 200,
      previewUrl: '',
      source: 'youtube',
      playCount: 1000000,
    },
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: 'Divide',
      cover: '',
      duration: 234,
      previewUrl: '',
      source: 'amazon',
      genre: 'Pop',
      releaseDate: '2017-01-01',
    },
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'Get Lucky',
      artist: 'Daft Punk',
      album: 'RAM',
      cover: '',
      duration: 300,
      previewUrl: '',
      source: 'apple',
      genre: 'Electronic',
      releaseDate: '2013-05-17',
    },
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'Radioactive',
      artist: 'Imagine Dragons',
      album: 'Night Visions',
      cover: '',
      duration: 197,
      previewUrl: '',
      source: 'youtube',
      playCount: 500000,
    },
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'Dreams',
      artist: 'Fleetwood Mac',
      album: 'Rumours',
      cover: '',
      duration: 257,
      previewUrl: '',
      source: 'amazon',
      genre: 'Rock',
      releaseDate: '1977-02-04',
    },
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'The Less I Know The Better',
      artist: 'Tame Impala',
      album: 'Currents',
      cover: '',
      duration: 200,
      previewUrl: '',
      source: 'apple',
      genre: 'Indie',
      releaseDate: '2015-12-17',
    },
    {
      id: `seed_${randomBytes(8).toString('hex')}`,
      title: 'Rolling in the Deep',
      artist: 'Adele',
      album: '21',
      cover: '',
      duration: 224,
      previewUrl: '',
      source: 'youtube',
      playCount: 700000,
    },
  ]

  // Store in cookie with songs for development
  const existingData = cookieStore.get('sonicflow_library')?.value
  const existingSongs = existingData ? JSON.parse(existingData) : []

  cookieStore.set('sonicflow_library', JSON.stringify([...existingSongs, ...sampleSongs]), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })

  return NextResponse.json({
    success: true,
    songs: sampleSongs,
    count: sampleSongs.length,
  })
  } catch (error) {
    console.error('Seed database error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}