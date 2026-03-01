'use client';

import Link from 'next/link';
import { Apple, PlayCircle, Cloud, ArrowRight } from 'lucide-react';

export default function AuthChoosePage() {
  const handleChoose = (service: string) => {
    // In a real app, this would redirect to the OAuth flow
    alert(`Connecting to ${service}... In production, this would open the OAuth consent screen.`);
  };

  const services = [
    {
      id: 'amazon',
      name: 'Amazon Music',
      icon: <Cloud className="w-10 h-10 text-yellow-300" />,
      color: 'from-yellow-500 to-orange-500',
      accent: 'text-yellow-300',
    },
    {
      id: 'apple',
      name: 'Apple Music',
      icon: <Apple className="w-10 h-10 text-gray-200" />,
      color: 'from-gray-700 to-gray-800',
      accent: 'text-gray-200',
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      icon: <PlayCircle className="w-10 h-10 text-red-500" />,
      color: 'from-red-500 to-red-600',
      accent: 'text-red-400',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white">
      <Link
        href="/"
        className="block px-6 py-4 hover:bg-black/20 -mx-6 transition-colors"
      >
        ← Back to Home
      </Link>

      <div className="max-w-md mx-auto px-6 py-12 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">
            Connect Music Services
          </h1>
          <p className="text-purple-200">
            Choose your preferred music provider
          </p>
        </div>

        {/* Service Selection */}
        <div className="w-full space-y-4 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleChoose(service.name)}
              className="w-full bg-gradient-to-br from-violet-800 to-purple-900 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">
                {service.name}
              </h3>
              <p className="text-center text-purple-200 text-sm">
                Connect to import your playlists and songs
              </p>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center max-w-md">
          <p className="text-purple-200 text-sm">
            <span className="text-purple-400">🔒</span>
            Your credentials are stored securely and never shared
          </p>
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-purple-200 text-xs">
              No account yet? Check out the{' '}
              <Link href="/signup" className="text-purple-400 font-semibold hover:underline">
                signup page
              </Link>{' '}
              for more options
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8">
          <Link
            href="/"
            className="flex items-center text-purple-300 hover:text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}