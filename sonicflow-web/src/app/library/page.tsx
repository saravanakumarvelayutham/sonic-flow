'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, X, Music, Sparkles } from 'lucide-react';
import { SongCard } from '@/components/library';

interface LibrarySong {
  id: string;
  title: string;
  artist: string;
  imageUrl?: string;
  duration?: number;
  style?: string;
  mood?: string;
  [key: string]: unknown;
}

const normalizeSongs = (data: unknown): LibrarySong[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item, index) => ({
      id: typeof item.id === 'string' ? item.id : `song-${index}`,
      title: typeof item.title === 'string' ? item.title : 'Untitled',
      artist: typeof item.artist === 'string' ? item.artist : 'Unknown Artist',
      imageUrl:
        typeof item.imageUrl === 'string'
          ? item.imageUrl
          : typeof item.coverUrl === 'string'
            ? item.coverUrl
            : typeof item.cover === 'string'
              ? item.cover
              : undefined,
      duration: typeof item.duration === 'number' ? item.duration : undefined,
      style: typeof item.style === 'string' ? item.style : undefined,
      mood: typeof item.mood === 'string' ? item.mood : undefined,
      ...item,
    }));
};

export default function LibraryPage() {
  const [songs, setSongs] = useState<LibrarySong[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState('All');
  const [filterMood, setFilterMood] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // Fetch songs
    fetch('/api/songs')
      .then((res) => res.json())
      .then((data) => {
        setSongs(normalizeSongs(data?.songs));
      });
  }, []);

  const filteredSongs = useMemo(() => {
    let filtered = [...songs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query)
      );
    }

    if (filterStyle !== 'All') {
      filtered = filtered.filter((song) => song.style === filterStyle);
    }

    if (filterMood !== 'All') {
      filtered = filtered.filter((song) => song.mood === filterMood);
    }

    return filtered;
  }, [songs, searchQuery, filterStyle, filterMood]);

  const styles = ['All', 'Synthwave', 'Electronic', 'Chill', 'Pop', 'Rock', 'Jazz'];
  const moods = ['All', 'Energetic', 'Chill', 'Melancholic', 'Happy', 'Focus'];

  if (!songs.length) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <Music className="w-16 h-16 mx-auto mb-6 text-purple-300" />
            <h2 className="text-2xl font-bold mb-4">Your Library is Empty</h2>
            <p className="text-purple-200 mb-6">
              Import songs from your music services or use AI recommendations
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/auth/choose"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Songs
              </a>
              <a
                href="/ai/generate"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <Sparkles className="w-5 h-5" />
                AI Generate
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Your Library</h1>
            <div className="flex items-center gap-2">
              <Link
                href="/library/add"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Songs
              </Link>
              <a
                href="/ai/generate"
                className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate
              </a>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="text"
                  placeholder="Search songs and artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-lg pl-10 pr-4 py-2 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(filterStyle !== 'All' || filterMood !== 'All') && (
            <div className="mt-2 flex items-center gap-2">
              {filterStyle !== 'All' && (
                <span className="bg-purple-500/30 px-3 py-1 rounded-full text-sm">
                  Style: {filterStyle}{' '}
                  <button onClick={() => setFilterStyle('All')} className="ml-1 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filterMood !== 'All' && (
                <span className="bg-purple-500/30 px-3 py-1 rounded-full text-sm">
                  Mood: {filterMood}{' '}
                  <button onClick={() => setFilterMood('All')} className="ml-1 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Filter dropdown */}
      {isFilterOpen && (
        <div className="max-w-7xl mx-auto px-6 pb-4">
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Style</h3>
                <div className="flex flex-wrap gap-2">
                  {styles.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStyle(s)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        filterStyle === s
                          ? 'bg-purple-500'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Mood</h3>
                <div className="flex flex-wrap gap-2">
                  {moods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setFilterMood(m)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        filterMood === m
                          ? 'bg-purple-500'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Songs grid */}
      <section className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </section>

      {/* Empty state */}
      {filteredSongs.length === 0 && (
        <div className="px-6 py-12">
          <div className="text-center">
            <p className="text-purple-200">No songs match your filters</p>
          </div>
        </div>
      )}
    </main>
  );
}