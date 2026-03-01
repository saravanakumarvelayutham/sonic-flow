'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Music, Sparkles, Palette, Clock, Play } from 'lucide-react';

export default function Home() {
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const getSongCount = () => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('sonicflow-songs');
    return saved ? JSON.parse(saved).length : 0;
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blasts, setBlasts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const blastIdRef = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const connection =
      (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string; addEventListener?: (event: string, callback: () => void) => void; removeEventListener?: (event: string, callback: () => void) => void };
      }).connection;

    const updateBandwidthMode = () => {
      const effectiveType = connection?.effectiveType;
      const low = Boolean(connection?.saveData || effectiveType === 'slow-2g' || effectiveType === '2g');
      setIsLowBandwidth(low);
      if (low && typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-low-bandwidth', 'true');
      }
    };

    updateBandwidthMode();
    connection?.addEventListener?.('change', updateBandwidthMode);

    return () => {
      connection?.removeEventListener?.('change', updateBandwidthMode);
    };
  }, []);

  useEffect(() => {
    if (isLowBandwidth) {
      return;
    }

    const spawnBlast = (x: number, y: number) => {
      const blast = {
        id: blastIdRef.current++,
        x,
        y,
      };
      setBlasts((prev) => [...prev, blast]);
      setTimeout(() => {
        setBlasts((prev) => prev.filter((b) => b.id !== blast.id));
      }, 800);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        rafRef.current = null;
      });
    };

    const handleInteraction = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent) {
        spawnBlast(e.clientX, e.clientY);
      }
    };

    const handleKeydown = () => {
      if (mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        spawnBlast(rect.width / 2, rect.height / 2);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleKeydown);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isLowBandwidth]);

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white"
    >
      {!isLowBandwidth && (
        <>
          <div
            className="low-bandwidth-hide pointer-events-none fixed h-96 w-96 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-3xl opacity-20"
            style={{
              left: `${mousePos.x - 192}px`,
              top: `${mousePos.y - 192}px`,
              transition: 'all 0.1s ease-out',
              zIndex: 0,
            }}
          />

          {blasts.map((blast) => (
            <div
              key={blast.id}
              className="reactive-blast bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
              style={{
                left: `${blast.x}px`,
                top: `${blast.y}px`,
                width: '60px',
                height: '60px',
                marginLeft: '-30px',
                marginTop: '-30px',
                zIndex: 1,
              }}
            />
          ))}
        </>
      )}

      <div className="low-bandwidth-hide pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" style={{ animation: 'float 12s ease-in-out infinite' }} />
      <div className="low-bandwidth-hide pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '1.2s' }} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500 via-purple-500 to-indigo-500"></div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0">
          <ParticleAnimation isLowBandwidth={isLowBandwidth} />
        </div>

        <div className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Music className="w-12 h-12 sonic-pulse rounded-full" />
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
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/choose"
                prefetch={!isLowBandwidth}
                className="sonic-gradient-shift flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
              >
                <Play className="w-5 h-5" />
                Get Started
              </Link>
              <Link
                href="/library"
                prefetch={!isLowBandwidth}
                className="border-2 border-white/30 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Browse Library
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1">
                <div className="text-3xl font-bold">{getSongCount()}</div>
                <div className="text-sm text-purple-200">Songs Imported</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-purple-200">Sources Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1">
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
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/40"
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
function ParticleAnimation({ isLowBandwidth }: { isLowBandwidth: boolean }) {
  const particles = useMemo(() => {
    const count = isLowBandwidth ? 8 : 20;
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: (index * 17) % 100,
      top: (index * 29) % 100,
      duration: 10 + (index % 7) * 3,
      delay: (index % 5) * 0.6,
    }));
  }, [isLowBandwidth]);

  return (
    <div className={`absolute inset-0 ${isLowBandwidth ? 'low-bandwidth-hide' : ''}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 bg-pink-500 rounded-full opacity-50"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `float ${particle.duration}s infinite ease-in-out`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}