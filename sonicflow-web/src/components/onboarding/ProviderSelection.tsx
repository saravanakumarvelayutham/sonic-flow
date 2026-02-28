'use client'

import { useState } from 'react'
import { useSession } from '@/lib/hooks/useSession'

export function ProviderSelection() {
  const { setPreferences, preferences } = useSession()
  const [selectedProvider, setSelectedProvider] = useState<string[]>(preferences.connectedAccounts || {} as any)
  const [isSyncing, setIsSyncing] = useState(false)

  const providers = [
    {
      id: 'spotify',
      name: 'Spotify',
      emoji: '🔊',
      color: 'from-green-500 to-green-600',
      description: 'Connect your Spotify library to start discovering',
    },
    {
      id: 'apple',
      name: 'Apple Music',
      emoji: '🍎',
      color: 'from-pink-500 to-pink-600',
      description: 'Connect your Apple Music library seamlessly',
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      emoji: '▶️',
      color: 'from-red-500 to-red-600',
      description: 'Bring your favorite YouTube playlists to life',
    },
    {
      id: 'amazon',
      name: 'Amazon Music',
      emoji: '☁️',
      color: 'from-yellow-500 to-orange-500',
      description: 'Access millions of songs instantly',
    },
  ]

  const handleSelect = async (providerId: string) => {
    // Check if already connected
    if (selectedProvider.includes(providerId)) {
      // Remove
      setSelectedProvider(selectedProvider.filter((p) => p !== providerId))
      return
    }

    setIsSyncing(true)

    // Simulate authentication process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add to selected
      setSelectedProvider([...selectedProvider, providerId])

      // Update session preferences
      setPreferences({
        ...preferences,
        connectedAccounts: {
          ...preferences.connectedAccounts,
          [providerId]: true,
        },
      })

      // Sync library in background
      await syncLibrary(providerId)
    } catch (error) {
      console.error('Failed to connect provider:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const syncLibrary = async (providerId: string) => {
    // In production, this would call your API
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(`Syncing library for ${providerId}`)
  }

  const isAnySelected = selectedProvider.length > 0

  return (
    <div className="w-full max-w-lg">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Connect Your Music Services</h2>
        <p className="text-gray-400">
          Choose the music services you use. We'll connect them and start curating recommendations just for you.
        </p>
      </div>

      {/* Provider cards */}
      <div className="space-y-3 mb-8">
        {providers.map((provider) => {
          const isSelected = selectedProvider.includes(provider.id)
          const isSyncingProvider = provider.id === provider.id && isSyncing

          return (
            <button
              key={provider.id}
              onClick={() => handleSelect(provider.id)}
              disabled={isSyncingProvider}
              className={`relative flex items-center p-6 rounded-2xl transition-all bg-white border-2 ${
                isSelected
                  ? 'border-green-500 shadow-lg shadow-green-200'
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                isSyncingProvider ? 'cursor-wait' : 'cursor-pointer'
              }`}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Provider icon and info */}
              <div className="flex items-center">
                <span className="text-5xl mr-4">{provider.emoji}</span>
                <div>
                  <h3 className="font-semibold text-lg">{provider.name}</h3>
                  <p className="text-sm text-gray-500">{provider.description}</p>
                </div>
              </div>

              {/* Sync indicator */}
              {isSyncingProvider && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Info message */}
      {isAnySelected && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">✓</span>
            <span className="text-green-700">
              You're connected to {selectedProvider.length} music service(s). We're syncing your library now.
            </span>
          </div>
        </div>
      )}

      {/* Next button */}
      {isAnySelected && (
        <button
          onClick={() => window.location.href = '/welcome/preferences'}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white hover:opacity-90 transition-opacity"
        >
          Continue to Preferences
        </button>
      )}
    </div>
  )
}