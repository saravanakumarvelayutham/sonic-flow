'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Music, Sliders, Clock, Heart, Loader2 } from 'lucide-react';

interface GeneratedSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  style: string;
  mood: string;
  source: string;
}

export default function AIGeneratePage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedSong[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');

  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('Energetic');
  const [style, setStyle] = useState('Electronic');
  const [duration, setDuration] = useState(30);
  const [energy, setEnergy] = useState('Medium');
  const [favoriteArtists, setFavoriteArtists] = useState('');

  const moods = ['Energetic', 'Chill', 'Melancholic', 'Happy', 'Focus'];
  const styles = ['Electronic', 'Synthwave', 'Pop', 'Rock', 'Jazz', 'Ambient'];
  const durations = [15, 30, 45, 60, 90];

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated([]);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const mockSongs = generateMockPlaylist();
    setGenerated(mockSongs);
    setGenerating(false);
  };

  const generateMockPlaylist = (): GeneratedSong[] => [
    {
      id: `gen-${Date.now()}`,
      title: `${prompt || 'AI Generated'} - ${mood} Collection`,
      artist: 'AI Recommended',
      album: `${prompt || 'AI Playlist'}`,
      coverUrl: '/ai-cover.jpg',
      style: style,
      mood: mood,
      source: 'AI Generated',
    },
    {
      id: `gen-${Date.now()}-2`,
      title: `${style} Masterpiece`,
      artist: `${mood} Vibes`,
      album: 'Curated Selection',
      coverUrl: '/ai-cover-2.jpg',
      style: style,
      mood: mood,
      source: 'AI Generated',
    },
    {
      id: `gen-${Date.now()}-3`,
      title: 'Energy Boost',
      artist: 'Active Mix',
      album: `${energy} Energy`,
      coverUrl: '/ai-cover-3.jpg',
      style: style,
      mood: mood,
      source: 'AI Generated',
    },
  ];

  const addToLibrary = () => {
    // In a real app, this would add to the library
    alert('Songs added to library!');
    setGenerated([]);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white">
      <div className="low-bandwidth-hide pointer-events-none absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" style={{ animation: 'float 14s ease-in-out infinite' }} />
      <div className="low-bandwidth-hide pointer-events-none absolute right-[-120px] bottom-[-80px] h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" style={{ animation: 'float 17s ease-in-out infinite', animationDelay: '0.8s' }} />

      <Link
        href="/library"
        className="block px-6 py-4 hover:bg-black/20 -mx-6 transition-colors"
      >
        ← Back to Library
      </Link>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">
            <Sparkles className="w-8 h-8 inline mr-2 text-purple-300" />
            AI Playlist Generator
          </h1>
          <p className="text-purple-200">
            Describe your ideal playlist and let AI create it for you
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Generate
          </button>
          <button
            onClick={() => window.location.href = '/library'}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Music className="w-5 h-5 inline mr-2" />
            Library
          </button>
        </div>

        {/* Generator Section */}
        {activeTab === 'generate' && (
          <>
            {/* Prompt input */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
              <label className="block text-sm font-semibold mb-2 text-purple-300">
                Describe your playlist
              </label>
              <textarea
                placeholder="e.g., Morning focus, rainy days, high energy workout..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/10 rounded-lg p-3 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 focus:bg-white/15"
                rows={3}
              />
            </div>

            {/* Settings */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Mood */}
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/25">
                <label className="block text-sm font-semibold mb-3 text-purple-300">
                  <Sliders className="w-4 h-4 inline mr-1" />
                  Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-white/10 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {moods.map((m) => (
                    <option key={m} value={m} className="bg-purple-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Style */}
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/25">
                <label className="block text-sm font-semibold mb-3 text-purple-300">
                  <Sliders className="w-4 h-4 inline mr-1" />
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-white/10 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {styles.map((s) => (
                    <option key={s} value={s} className="bg-purple-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Energy */}
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/25">
                <label className="block text-sm font-semibold mb-3 text-purple-300">
                  <Sliders className="w-4 h-4 inline mr-1" />
                  Energy Level
                </label>
                <select
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                  className="w-full bg-white/10 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Low" className="bg-purple-900 text-white">Low</option>
                  <option value="Medium" className="bg-purple-900 text-white">Medium</option>
                  <option value="High" className="bg-purple-900 text-white">High</option>
                </select>
              </div>

              {/* Duration */}
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/25">
                <label className="block text-sm font-semibold mb-3 text-purple-300">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration
                </label>
                <select
                  value={duration.toString()}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-white/10 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {durations.map((d) => (
                    <option key={d} value={d.toString()} className="bg-purple-900 text-white">
                      {d} min
                    </option>
                  ))}
                </select>
              </div>

              {/* Favorite Artists */}
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10 md:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:border-white/25">
                <label className="block text-sm font-semibold mb-2 text-purple-300">
                  <Heart className="w-4 h-4 inline mr-1" />
                  Favorite Artists (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Daft Punk, Tame Impala, Lo-fi Girl..."
                  value={favoriteArtists}
                  onChange={(e) => setFavoriteArtists(e.target.value)}
                  className="w-full bg-white/10 rounded-lg p-2 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="sonic-gradient-shift w-full bg-gradient-to-r from-purple-500 to-indigo-500 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/30"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Playlist
                </>
              )}
            </button>

            {/* Results */}
            {generated.length > 0 && (
              <div className="mt-8">
                <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Your AI Generated Playlist
                  </h2>
                  {generated.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-4 p-3 mb-3 bg-white/5 rounded-lg transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-violet-900 flex items-center justify-center">
                        <Music className="w-full h-full text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{song.title}</h4>
                        <p className="text-purple-300 text-sm">{song.artist}</p>
                      </div>
                      <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">
                        {song.mood}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={addToLibrary}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold transition-all hover:from-pink-400 hover:to-purple-400"
                  >
                    Add to Library
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Library Section */}
        {activeTab === 'library' && (
          <div>
            <Link
              href="/library"
              className="w-full bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
            >
              <Music className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h2 className="text-2xl font-bold mb-2 text-center">
                Your Library
              </h2>
              <p className="text-purple-200 text-center">
                Browse and manage your imported songs
              </p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}