/**
 * OAuth Client Utilities
 * Shared OAuth client logic for all providers
 */

import { cookies } from 'next/headers'
import { headers } from 'next/headers'

// Types
export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string
  authEndpoint: string
  tokenEndpoint: string
  userInfoEndpoint?: string
}

export interface OAuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface OAuthUser {
  id: string | number
  name: string | null
  email: string | null
  emailVerified?: boolean | null
  image?: string | null
}

export interface SessionData {
  id: string
  accessToken: string
  refreshToken: string
  provider: 'apple' | 'youtube' | 'amazon'
  user: OAuthUser
  preferences?: {
    style: 'minimal' | 'feature-rich' | 'mixed'
    mood: 'focused' | 'relaxed' | 'energetic' | 'playful'
    weeklyPrompt?: string
  }
  createdAt: string
  expiresAt: string
}

export interface AuthError extends Error {
  code?: string
  provider?: string
  details?: unknown
}

// Configuration
const getOAuthConfig = (): Record<string, OAuthConfig> => ({
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || '',
    clientSecret: process.env.APPLE_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/apple/callback`,
    scope: 'user.read',
    authEndpoint: 'https://api.music.apple.com/v1/me',
    tokenEndpoint: 'https://api.music.apple.com/v1/token',
  },
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID || '',
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/youtube/callback`,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    authEndpoint: 'https://oauth2.googleapis.com/token',
    tokenEndpoint: 'https://oauth2.googleapis.io/token',
  },
  amazon: {
    clientId: process.env.AMAZON_CLIENT_ID || '',
    clientSecret: process.env.AMAZON_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/amazon/callback`,
    scope: 'profile',
    authEndpoint: 'https://api.amazon.com/auth/o2/token',
    tokenEndpoint: 'https://api.amazon.com/auth/o2/token',
    userInfoEndpoint: 'https://api.amazon.com/user/profile',
  },
})

// Token Validation
const isTokenExpired = (expiresAt: string): boolean => {
  const expiryDate = new Date(expiresAt)
  const now = new Date()
  // Check if expires in less than 5 minutes
  const timeLeft = expiryDate.getTime() - now.getTime()
  return timeLeft < 5 * 60 * 1000
}

const refreshAccessToken = async (
  provider: string,
  currentRefreshToken: string
): Promise<{ accessToken: string; expiresAt: string }> => {
  const config = getOAuthConfig()[provider]

  if (!config.clientSecret) {
    throw new Error(`Missing client secret for ${provider}`)
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: currentRefreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  })

  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(`Failed to refresh token for ${provider}: ${data.error}`)
  }

  const expiresAt = new Date(Date.now() + data.expires_in * 1000)
    .toISOString()

  return {
    accessToken: data.access_token,
    expiresAt,
  }
}

// Session Management
export const createSession = async (data: SessionData): Promise<void> => {
  const cookieStore = await cookies()
  const sessionExpiry = new Date(data.expiresAt)
  cookieStore.set('sonicflow_session', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Math.floor((sessionExpiry.getTime() - Date.now()) / 1000),
    path: '/',
  })
}

export const getSession = async (): Promise<SessionData | null> => {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('sonicflow_session')

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return session
  } catch {
    return null
  }
}

export const invalidateSession = async (): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete('sonicflow_session')
}

export const clearAuthCookies = async (): Promise<void> => {
  const cookieStore = await cookies()

  const authCookies = [
    'apple_auth_state',
    'youtube_auth_state',
    'amazon_auth_state',
  ]

  for (const cookieName of authCookies) {
    cookieStore.delete(cookieName)
  }
}

// State Validation
interface AuthState {
  provider: string
  nonce: string
  timestamp: number
}

const authState = new Map<string, AuthState>()

export const createAuthState = async (provider: string, nonce: string): Promise<string> => {
  const state = JSON.stringify({
    provider,
    nonce,
    timestamp: Date.now(),
  })

  // Rotate state after 5 minutes
  const expiresAt = Date.now() + 5 * 60 * 1000

  const cookieStore = await cookies()
  cookieStore.set('apple_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300,
    path: '/',
  })

  return state
}

export const validateAuthState = async (
  state: string,
  expectedState: string,
  requireProvider?: string
): Promise<{ valid: boolean; provider?: string }> => {
  try {
    if (state !== expectedState) {
      return { valid: false }
    }

    const stateData = JSON.parse(state)

    // Validate nonce
    if (stateData.nonce) {
      const nonceKey = `nonce_${stateData.provider}-${stateData.nonce}`
      const cookieStore = await cookies()
      const storedNonce = cookieStore.get(nonceKey)

      if (storedNonce?.value !== expectedState) {
        await clearAuthCookies()
        return { valid: false }
      }

      cookieStore.delete(nonceKey)
    }

    // Validate timestamp (not too old)
    const timestampAge = Date.now() - stateData.timestamp
    if (timestampAge > 10 * 60 * 1000) { // 10 minutes max
      await clearAuthCookies()
      return { valid: false }
    }

    // Validate provider match if specified
    if (requireProvider && stateData.provider !== requireProvider) {
      await clearAuthCookies()
      return { valid: false }
    }

    return { valid: true, provider: stateData.provider }
  } catch (error) {
    await clearAuthCookies()
    return { valid: false }
  }
}

// Cleanup old states
setInterval(() => {
  authState.forEach((state, key) => {
    if (Date.now() - state.timestamp > 10 * 60 * 1000) {
      authState.delete(key)
    }
  })
}, 60 * 1000) // Every minute

// Structured Logging
export const logAuthEvent = async (event: 'login' | 'logout' | 'refresh' | 'error' | 'timeout', data: Record<string, unknown>): Promise<void> => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') ?? 'unknown'
  const timestamp = new Date().toISOString()

  console.log(`[${timestamp}] [AUTH] [${event}] -`, data)
}

// Background task utilities
export const authBackgroundTask = async (taskName: string, taskFn: () => Promise<void>): Promise<void> => {
  try {
    await taskFn()
  } catch (error) {
    console.error(`Background task '${taskName}' failed:`, error)
  }
}

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headersList = await headers()
  return {
    'user-agent': headersList.get('user-agent') ?? 'unknown',
    'authorization': headersList.get('authorization') ?? '',
  }
}

// Export all functions
export default {
  getOAuthConfig,
  createSession,
  getSession,
  invalidateSession,
  createAuthState,
  validateAuthState,
  clearAuthCookies,
  refreshAccessToken,
  isTokenExpired,
  logAuthEvent,
  authBackgroundTask,
  getAuthHeaders,
}