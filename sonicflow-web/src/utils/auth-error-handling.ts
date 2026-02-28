/**
 * Auth Error Handling Utilities
 * Client-side utilities for handling and communicating auth errors
 */
'use client'

import { logAuthEvent } from '@/lib/oauth-client'
import { useState, useCallback } from 'react'

export type AuthErrorType = 'authentication_failed' | 'token_expired' | 'state_mismatch' | 'network_error' | 'permission_denied' | 'session_timeout'

export interface AuthUserError {
  type: AuthErrorType
  provider: string
  message: string
  details?: unknown
  timestamp: string
}

// Error Categories
const errorCategories: Record<AuthErrorType, string> = {
  authentication_failed: 'Authentication Failed',
  token_expired: 'Token Expired',
  state_mismatch: 'Session Mismatch',
  network_error: 'Network Error',
  permission_denied: 'Permission Denied',
  session_timeout: 'Session Timeout',
}

// Map provider-specific errors to error types
function mapProviderError(provider: string, rawError: Error): AuthErrorType {
  const lowError = rawError.message.toLowerCase()

  // State mismatch errors
  if (
    lowError.includes('state') ||
    lowError.includes('mismatch') ||
    lowError.includes('corrupt')
  ) {
    return 'state_mismatch'
  }

  // Token expired errors
  if (
    lowError.includes('expired') ||
    lowError.includes('expired at') ||
    lowError.includes('invalid token')
  ) {
    return 'token_expired'
  }

  // Permission denied
  if (
    lowError.includes('permission') ||
    lowError.includes('unauthorized') ||
    lowError.includes('forbidden')
  ) {
    return 'permission_denied'
  }

  // Network errors
  if (
    lowError.includes('network') ||
    lowError.includes('connection') ||
    lowError.includes('timeout')
  ) {
    return 'network_error'
  }

  // Default to authentication failed
  return 'authentication_failed'
}

// Create a user-friendly auth error
export function createUserFriendlyError(
  provider: string,
  rawError: Error,
  additionalContext?: Record<string, unknown>
): AuthUserError {
  const errorType = mapProviderError(provider, rawError)
  const displayMessage = errorCategories[errorType]

  // Log the auth error
  logAuthEvent('error', {
    provider,
    code: rawError.name,
    message: rawError.message,
    timestamp: new Date().toISOString(),
  })

  // Normalize error details
  const normalizedDetails = normalizeErrorDetails(rawError)

  return {
    type: errorType,
    provider,
    message: displayMessage,
    details: normalizedDetails,
    timestamp: new Date().toISOString(),
  }
}

// Normalize error details for display
function normalizeErrorDetails(rawError: Error): unknown {
  try {
    if (rawError.name === 'ValidationError' && rawError.message) {
      // Parse detailed validation errors
      const details: Record<string, unknown> = { originalMessage: rawError.message }

      // Extract JSON-like details if present
      if (rawError.message.includes('{')) {
        try {
          const jsonMatch = rawError.message.match(/\{[^}]*\}/)
          if (jsonMatch) {
            details.parsed = JSON.parse(jsonMatch[0])
          }
        } catch {
          // Keep original message if parsing fails
        }
      }

      return {
        validation: details,
      }
    }

    return {
      name: rawError.name,
      message: rawError.message,
    }
  } catch {
    return {
      message: 'Unable to retrieve error details',
    }
  }
}

// Error handling hook for React components
export function useAuthError(): {
  error: AuthUserError | null
  formatError: (error: AuthUserError) => string
  clearError: () => void
  retryAuth: () => void
} {
  const [error, setError] = useState<AuthUserError | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const formatError = useCallback((err: AuthUserError): string => {
    const providerName = err.provider.charAt(0).toUpperCase() + err.provider.slice(1)

    switch (err.type) {
      case 'token_expired':
        return `Your ${providerName} session has expired. Please sign in again to continue.`
      case 'state_mismatch':
        return `There's a mismatch in your ${providerName} session. We'll start fresh.`
      case 'network_error':
        return `Network issue while connecting to ${providerName}. Check your connection and try again.`
      case 'permission_denied':
        return `We need additional permissions from ${providerName} to proceed.`
      case 'session_timeout':
        return `${providerName} session has timed out. Sign in again to continue.`
      default:
        return `Authentication with ${providerName} failed. Please try again.`
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])
  const retryAuth = useCallback(() => {
    setRetryCount(prev => prev + 1)
  }, [])

  return {
    error,
    formatError,
    clearError,
    retryAuth,
  }
}