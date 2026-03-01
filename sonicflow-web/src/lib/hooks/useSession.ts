'use client'

import { useState, useCallback } from 'react'
import type { Session } from '@/types'

export interface SessionPreferences {
  style: 'minimal' | 'feature-rich' | 'mixed'
  mood: 'focused' | 'relaxed' | 'energetic' | 'playful'
  weeklyPrompt?: string
  connectedAccounts?: Record<string, boolean>
}

export interface UseSessionReturn {
  session: Session | null
  activeStep: number
  setActiveStep: (step: number | ((prev: number) => number)) => void
  preferences: SessionPreferences
  setPreferences: (prefs: SessionPreferences) => void
  isLoading: boolean
}

export function useSession(): UseSessionReturn {
  const [session] = useState<Session | null>(null)
  const [activeStep, setActiveStepState] = useState(0)
  const [preferences, setPreferencesState] = useState<SessionPreferences>({
    style: 'mixed',
    mood: 'focused',
    connectedAccounts: {},
  })
  const [isLoading] = useState(false)

  const setActiveStep = useCallback((step: number | ((prev: number) => number)) => {
    if (typeof step === 'function') {
      setActiveStepState(step)
    } else {
      setActiveStepState(step)
    }
  }, [])

  const setPreferences = useCallback((prefs: SessionPreferences) => {
    setPreferencesState(prefs)
  }, [])

  return {
    session,
    activeStep,
    setActiveStep,
    preferences,
    setPreferences,
    isLoading,
  }
}
