import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET: Get AI song recommendations
export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const style = searchParams.get('style');
  const mood = searchParams.get('mood');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    // Get session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sonicflow_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Simplified AI recommendations (in-memory)
    const recommendations = await generateRecommendations(style ?? undefined, mood ?? undefined, limit);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// POST: Generate AI playlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { style, mood, count } = body;

    // Get session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sonicflow_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const playlist = await generatePlaylist(style, mood, count || 10);

    return NextResponse.json(
      { playlist: playlist },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
}

async function generateRecommendations(style?: string, mood?: string, limit: number = 10) {
  // This is a placeholder for real AI recommendations
  // In a production app, this would call an OpenAI or similar API

  const recommendations = [
    {
      id: 'rec-1',
      title: 'Neon Dreams',
      artist: 'Synthwave Boy',
      album: 'Retro Future',
      coverUrl: '/album-cover-1.jpg',
      style: 'Synthwave',
      mood: 'Energetic',
      source: 'Amazon Music',
    },
    {
      id: 'rec-2',
      title: 'Midnight Drive',
      artist: 'Night Runner',
      album: 'Urban Shadows',
      coverUrl: '/album-cover-2.jpg',
      style: 'Synthwave',
      mood: 'Chill',
      source: 'Amazon Music',
    },
    {
      id: 'rec-3',
      title: 'Digital Sunset',
      artist: 'Cyber Dreams',
      album: 'Neon Nights',
      coverUrl: '/album-cover-3.jpg',
      style: 'Synthwave',
      mood: 'Energetic',
      source: 'YouTube',
    },
  ];

  return recommendations.slice(0, limit);
}

async function generatePlaylist(style?: string, mood?: string, count: number = 10) {
  // This is a placeholder for real AI playlist generation
  // In a production app, this would call an OpenAI API with user preferences

  const playlist = Array.from({ length: count }, (_, i) => ({
    id: `playlist-${i}`,
    title: `AI Mix ${i + 1}`,
    artist: 'SonicFlow AI',
    album: `Curated by AI`,
    coverUrl: `/ai-playlist-${i}.jpg`,
    style: style || 'Various',
    mood: mood || 'Balanced',
    source: 'SonicFlow AI',
    playlistId: `pl-${Date.now()}-${i}`,
  }));

  return playlist;
}