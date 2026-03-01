import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface StoredSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  source?: string;
  songUrl?: string;
  style?: string;
  mood?: string;
  addedAt?: string;
}

const parseSongs = (raw: string | undefined): StoredSong[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredSong[]) : [];
  } catch {
    return [];
  }
};

const getString = (value: unknown): string => (typeof value === 'string' ? value : '');

// GET: List songs (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const style = searchParams.get('style');
    const mood = searchParams.get('mood');

    // Get session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sonicflow_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get songs from localStorage
    const songsData = cookieStore.get('sonicflow-songs');
    let songs = parseSongs(songsData?.value);

    // Apply filters
    if (style) {
      songs = songs.filter((song) => song.style === style);
    }
    if (mood) {
      songs = songs.filter((song) => song.mood === mood);
    }

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

// POST: Create a song import task
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const payload = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
    const title = getString(payload.title);
    const artist = getString(payload.artist);
    const album = getString(payload.album);
    const coverUrl = getString(payload.coverUrl);
    const source = getString(payload.source);
    const songUrl = getString(payload.songUrl);

    // Get session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sonicflow_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current songs
    const songsData = cookieStore.get('sonicflow-songs');
    const existingSongs = parseSongs(songsData?.value);

    // Check if already exists
    const exists = existingSongs.some(
      (s) => s.title.toLowerCase() === title.toLowerCase() &&
                s.artist.toLowerCase() === artist.toLowerCase()
    );

    if (exists) {
      return NextResponse.json(
        { error: 'Song already exists' },
        { status: 409 }
      );
    }

    // Add new song
    const newSong = {
      id: crypto.randomUUID(),
      title,
      artist,
      album,
      coverUrl,
      source,
      songUrl,
      addedAt: new Date().toISOString(),
    };

    const updatedSongs = [...existingSongs, newSong];

    // Update cookies (in-memory for now)
    cookieStore.set('sonicflow-songs', JSON.stringify(updatedSongs), {
      httpOnly: false, // localStorage
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json(
      { song: newSong },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json(
      { error: 'Failed to create song' },
      { status: 500 }
    );
  }
}