/**
 * AuthErrorBoundary Component
 * Handles auth errors with friendly user messaging
 */
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logAuthEvent } from '@/lib/oauth-client'

export interface AuthError {
  provider: string
  code: string
  message: string
  details?: unknown
}

export interface AuthErrorBoundaryProps {
  provider: string
  children: ReactNode
  onError?: (error: AuthError) => void
}

export interface AuthErrorBoundaryState {
  hasError: boolean
  error: AuthError | null
  context: Record<string, unknown>
}

export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      context: {},
    }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    const detectedProvider = ['apple', 'youtube', 'amazon'].find(p =>
      error.message.toLowerCase().includes(p)
    ) || 'auth'
    
    return {
      hasError: true,
      error: {
        provider: detectedProvider,
        code: 'AUTH_ERROR',
        message: error.message,
        details: { message: error.message }
      },
      context: {},
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    const authError = this.state.error || {
      provider: ['apple', 'youtube', 'amazon'].find(p =>
        error.message.toLowerCase().includes(p)
      ) || 'auth',
      code: 'AUTH_ERROR',
      message: error.message,
      details: { message: error.message, ...errorInfo }
    }

    logAuthEvent('error', {
      provider: authError.provider,
      code: authError.code,
      message: authError.message,
      details: authError.details,
      timestamp: new Date().toISOString(),
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(authError)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { error } = this.state

      return (
        <div className="auth-error-boundary">
          <div className="error-container">
            <h3 className="error-title">
              Authentication Error
            </h3>
            <p className="error-message">
              {error?.message || 'Failed to complete authentication'}
            </p>
            <div className="error-details">
              {error?.details && typeof error.details === 'object' ? (
                <pre>{JSON.stringify(error.details as Record<string, unknown>, null, 2)}</pre>
              ) : null}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AuthErrorBoundary