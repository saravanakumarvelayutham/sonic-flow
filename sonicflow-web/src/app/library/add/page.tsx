'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, Apple, Music, PlayCircle, Heart, Sparkles } from 'lucide-react';

interface ImportedSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  style: string;
  mood: string;
  source: string;
}

export default function ImportPage() {
  const [importing, setImporting] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState<ImportedSong[]>([]);
  const [activeTab, setActiveTab] = useState<'import' | 'ai'>('import');

  // Simulated import process
  const handleImport = async (provider: string) => {
    setImporting(provider);
    setImported([]);
    setProgress(0);

    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => {
        setProgress(i);
      }, i * 30);
    }

    setTimeout(() => {
      setImported(generateMockSongs(provider));
      setImporting(null);
      setProgress(0);
    }, 3000);
  };

  const generateMockSongs = (provider: string): ImportedSong[] => [
    {
      id: `import-${provider}-1`,
      title: `${provider} Top Hits`,
      artist: provider,
      album: `${provider} Favorites`,
      coverUrl: `/album-cover-${provider}.jpg`,
      style: provider === 'spotify' ? 'Pop' : provider === 'apple' ? 'Electronic' : 'Chill',
      mood: 'Mixed',
      source: provider,
    },
    {
      id: `import-${provider}-2`,
      title: 'Best of 2024',
      artist: 'Various Artists',
      album: `${provider} Charts`,
      coverUrl: '/album-cover-1.jpg',
      style: 'Pop',
      mood: 'Energetic',
      source: provider,
    },
  ];

  const providers = [
    {
      id: 'spotify',
      name: 'Spotify',
      icon: <Music className="w-8 h-8 text-green-500" />,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'apple',
      name: 'Apple Music',
      icon: <Apple className="w-8 h-8 text-gray-200" />,
      color: 'from-gray-700 to-gray-800',
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      icon: <PlayCircle className="w-8 h-8 text-red-500" />,
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white">
      <Link
        href="/library"
        className="block px-6 py-4 hover:bg-black/20 -mx-6 transition-colors"
      >
        ← Back to Library
      </Link>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Import Songs</h1>
          <p className="text-purple-200">
            Add songs from your favorite music services
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'import'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            Import
          </button>
          <button
            onClick={() => window.location.href = '/ai/generate'}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            AI Generate
          </button>
        </div>

        {/* Import Section */}
        {activeTab === 'import' && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleImport(provider.id)}
                  disabled={importing !== null}
                  className="bg-gradient-to-br from-violet-800 to-purple-900 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center`}>
                    {provider.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{provider.name}</h3>
                  <p className="text-purple-200 text-sm">
                    Import your top songs and playlists
                  </p>
                </button>
              ))}
            </div>

            {/* Import Progress */}
            {importing && (
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${providers.find((p) => p.id === importing)?.color} flex items-center justify-center`}>
                    {providers.find((p) => p.id === importing)?.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Importing from {importing}...
                  </h3>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-purple-200 text-sm">
                    {progress}% complete
                  </p>
                </div>
              </div>
            )}

            {/* Imported Songs */}
            {imported.length > 0 && (
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Imported Songs
                </h2>
                {imported.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 p-3 mb-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <Music className="w-full h-full text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{song.title}</h4>
                      <p className="text-purple-300 text-sm">{song.artist}</p>
                    </div>
                    <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded-full">
                      Imported
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty import state */}
            {!importing && imported.length === 0 && (
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
                <Music className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                <p className="text-purple-200 mb-4">
                  Select a provider above to start importing your songs
                </p>
              </div>
            )}
          </>
        )}

        {/* AI Generate Section */}
        {activeTab === 'ai' && (
          <div>
            <button
              onClick={() => window.location.href = '/ai/generate'}
              className="w-full bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h2 className="text-2xl font-bold mb-2">AI Playlist Generator</h2>
              <p className="text-purple-200">
                Let AI create personalized playlists based on your preferences
              </p>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}