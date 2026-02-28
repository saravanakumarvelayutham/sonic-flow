'use server'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logAuthEvent } from '@/lib/oauth-client'

/**
 * Apple Token Refresh Endpoint
 * Refreshes tokens before expiration
 */

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('sonicflow_session')?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No valid session found' },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie)

    if (session.provider !== 'apple') {
      return NextResponse.json(
        { error: 'Not an Apple session' },
        { status: 400 }
      )
    }

    // Validate token isn't expired
    const expiryDate = new Date(session.expiresAt)
    const now = new Date()
    const timeLeft = expiryDate.getTime() - now.getTime()

    if (timeLeft > 5 * 60 * 1000) {
      // Not yet expired (no refresh needed)
      return NextResponse.json({
        success: true,
        needRefresh: false,
      })
    }

    // Implement token refresh logic here
    // await refreshAccessToken('apple', session.refreshToken)

    // For now, invalidate session and require new login
    await cookieStore.delete('sonicflow_session')

    logAuthEvent('refresh', {
      provider: 'apple',
      action: 'token_expired',
      tokenStillValid: false,
    })

    return NextResponse.json({
      success: true,
      needRefresh: true,
      message: 'Token expired - please login again',
    })
  } catch (error) {
    console.error('Apple token refresh error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

// Keep the old function for background task compatibility
export async function appleTokenRefresh() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('sonicflow_session')?.value

    if (!sessionCookie) {
      throw new Error('No valid session found')
    }

    const session = JSON.parse(sessionCookie)

    if (session.provider !== 'apple') {
      throw new Error('Not an Apple session')
    }

    // Validate token isn't expired
    const expiryDate = new Date(session.expiresAt)
    const now = new Date()
    const timeLeft = expiryDate.getTime() - now.getTime()

    if (timeLeft > 5 * 60 * 1000) {
      // Not yet expired (no refresh needed)
      return {
        success: true,
        needRefresh: false,
      }
    }

    // Implement token refresh logic here
    // await refreshAccessToken('apple', session.refreshToken)

    // For now, invalidate session and require new login
    await cookieStore.delete('sonicflow_session')

    logAuthEvent('refresh', {
      provider: 'apple',
      action: 'token_expired',
      tokenStillValid: false,
    })

    return {
      success: true,
      needRefresh: true,
      message: 'Token expired - please login again',
    }
  } catch (error) {
    console.error('Apple token refresh error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: 'Unknown error occurred',
    }
  }
}

// Background task to check expired tokens
setInterval(async () => {
  try {
    await appleTokenRefresh()
  } catch (error) {
    console.error('Background refresh task error:', error)
  }
}, 5 * 60 * 1000) // Every 5 minutes