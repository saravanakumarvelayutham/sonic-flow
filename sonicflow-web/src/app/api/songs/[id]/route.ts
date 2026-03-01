import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface StoredSong {
  id: string;
  [key: string]: unknown;
}

const parseSongs = (raw: string | undefined): StoredSong[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredSong =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof (item as { id?: unknown }).id === 'string'
    );
  } catch {
    return [];
  }
};

// GET: Get a specific song
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const songId = id;

    // Get session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sonicflow_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get songs
    const songsData = cookieStore.get('sonicflow-songs');
    const songs = parseSongs(songsData?.value);

    const song = songs.find((s) => s.id === songId);

    if (!song) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ song });
  } catch (error) {
    console.error('Error fetching song:', error);
    return NextResponse.json(
      { error: 'Failed to fetch song' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a song
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const songId = id;

    // Get session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sonicflow_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get songs
    const songsData = cookieStore.get('sonicflow-songs');
    const songs = parseSongs(songsData?.value);

    const filteredSongs = songs.filter((s) => s.id !== songId);

    if (filteredSongs.length === songs.length) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }

    // Update cookies
    cookieStore.set('sonicflow-songs', JSON.stringify(filteredSongs), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json(
      { error: 'Failed to delete song' },
      { status: 500 }
    );
  }
}