import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET: Get a specific song
export async function GET(
  request: NextRequest,
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
    const songs = songsData?.value ? JSON.parse(songsData.value) : [];

    const song = songs.find((s: any) => s.id === songId);

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
  request: NextRequest,
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
    let songs = songsData?.value ? JSON.parse(songsData.value) : [];

    const filteredSongs = songs.filter((s: any) => s.id !== songId);

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