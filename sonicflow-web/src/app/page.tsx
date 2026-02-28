'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Music, Sparkles, Palette, Clock, Play } from 'lucide-react';

export default function Home() {
  const [audioContext] = useState(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      return new (window as any).AudioContext();
    }
    return null;
  });

  const getSongCount = () => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('sonicflow-songs');
    return saved ? JSON.parse(saved).length : 0;
  };

  const handlePlayback = () => {
    if (audioContext) {
      audioContext.resume();
    } else {
      alert('Audio playback needs HTTPS or localhost');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500 via-purple-500 to-indigo-500"></div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0">
          <ParticleAnimation />
        </div>

        <div className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Music className="w-12 h-12" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent">
                SonicFlow
              </h1>
            </div>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              AI-powered music discovery • Smart playlists • Intelligent curation
            </p>

            <div className="flex gap-4 justify-center mb-12">
              {[
                { icon: Sparkles, text: 'AI-Powered' },
                { icon: Palette, text: 'Reactive Viz' },
                { icon: Clock, text: 'Smart Scheduling' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/choose"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Get Started
              </Link>
              <Link
                href="/library"
                className="border-2 border-white/30 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Browse Library
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold">{getSongCount()}</div>
                <div className="text-sm text-purple-200">Songs Imported</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-purple-200">Sources Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold">AI</div>
                <div className="text-sm text-purple-200">AI Integration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Music,
                title: 'Smart Library Imports',
                description: 'Seamlessly connect Apple Music, YouTube Music, and Amazon Music to bring your entire library into SonicFlow',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Sparkles,
                title: 'AI-Generated Playlists',
                description: 'Tell the AI what you want, and it creates custom playlists that match your unique taste and preferences',
                color: 'from-pink-500 to-rose-500',
              },
              {
                icon: Palette,
                title: 'Audio-Reactive Visuals',
                description: 'Watch your music come alive with stunning real-time visualizations synced to your favorite tracks',
                color: 'from-violet-500 to-purple-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-purple-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Background particle animation for visual appeal
function ParticleAnimation() {
  return (
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-pink-500 rounded-full opacity-50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + Math.random() * 20}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}