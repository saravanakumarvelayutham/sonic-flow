'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useSession'

export function WelcomeSection() {
  const { activeStep, setActiveStep, preferences, setPreferences } = useSession()
  const [isAnimating, setIsAnimating] = useState(false)

  const welcomeSteps = [
    {
      id: 1,
      title: 'Welcome to SonicFlow',
      description: 'Your personal AI-powered music discovery platform',
      emoji: '🎵',
      substeps: [
        { id: 1, text: 'Connect your favorite music services', emoji: '🔌' },
        { id: 2, text: 'Set your preferences', emoji: '🎯' },
        { id: 3, text: 'Start discovering', emoji: '🚀' },
      ],
    },
    {
      id: 2,
      title: 'Connect Your Music Libraries',
      description: 'Choose your preferred music service',
      emoji: '🎵',
      substeps: [
        { id: 1, text: 'Spotify', emoji: '🔊' },
        { id: 2, text: 'Apple Music', emoji: '🍎' },
        { id: 3, text: 'YouTube Music', emoji: '▶️' },
      ],
    },
    {
      id: 3,
      title: 'Set Your Style',
      description: 'Choose how SonicFlow looks and feels',
      emoji: '🎨',
      substeps: [
        { id: 1, text: 'Minimal interface', emoji: '✨' },
        { id: 2, text: 'Feature-rich experience', emoji: '🔧' },
        { id: 3, text: 'Perfect mix', emoji: '⚖️' },
      ],
    },
    {
      id: 4,
      title: 'Choose Your Mood',
      description: 'Configure how music makes you feel',
      emoji: '💖',
      substeps: [
        { id: 1, text: 'Focused', emoji: '🧠' },
        { id: 2, text: 'Relaxed', emoji: '😌' },
        { id: 3, text: 'Energetic', emoji: '⚡' },
      ],
    },
  ]

  const currentStep = welcomeSteps[activeStep - 1]

  useEffect(() => {
    if (activeStep > 0) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [activeStep])

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)

    // Update preferences if needed
    if (activeStep === 2 && preferences.style) {
      setPreferences({ ...preferences, style: 'minimal' })
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const isFirstStep = activeStep === 1
  const isLastStep = activeStep === welcomeSteps.length

  return (
    <div className="w-full max-w-lg">
      <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Step header */}
        <div className="flex items-center justify-center mb-8">
          <span className="text-6xl mb-4">{currentStep.emoji}</span>
        </div>

        {/* Step title and description */}
        <h2 className="text-3xl font-bold text-center mb-4">{currentStep.title}</h2>
        <p className="text-gray-400 text-center mb-8">{currentStep.description}</p>

        {/* Substeps */}
        {currentStep.substeps && (
          <div className="space-y-3 mb-8">
            {currentStep.substeps.map((substep) => (
              <div
                key={substep.id}
                className={`flex items-center p-4 rounded-xl transition-all ${
                  substep.id <= currentStep.substeps.length - (welcomeSteps.length - activeStep + 1)
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-2xl mr-3">{substep.emoji}</span>
                <span className={`font-medium ${substep.id <= currentStep.substeps.length - (welcomeSteps.length - activeStep + 1) ? 'text-green-600' : 'text-gray-400'}`}>
                  {substep.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              isFirstStep
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            {isFirstStep ? 'Skip' : 'Back'}
          </button>

          <button
            onClick={handleNext}
            disabled={isLastStep}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              isLastStep
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            {isLastStep ? 'Done' : 'Continue'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(activeStep - 1) / (welcomeSteps.length - 1) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Start</span>
            <span>Finish</span>
          </div>
        </div>
      </div>
    </div>
  )
}