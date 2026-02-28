'use server'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, state } = body

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state' },
        { status: 400 }
      )
    }

    // Exchange code for token (Apple Music uses custom auth flow)
    // In production: use Apple Music SDK
    const token = `apple_${code}_${Date.now()}`

    // Get user info - in production with Apple Music
    const user = {
      id: 'apple_user_123',
      email: 'user@applemusic.com',
      name: 'Apple Music User',
    }

    // Store session
    const cookieStore = await cookies()
    const session = {
      id: crypto.randomUUID(),
      accessToken: token,
      user: {
        ...user,
        provider: 'apple' as const,
      },
      preferences: {
        style: 'mixed' as const,
        mood: 'focused' as const,
        weeklyPrompt: 'workout' as const,
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    cookieStore.set('sonicflow_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return NextResponse.json({
      success: true,
      url: '/library',
    })
  } catch (error) {
    console.error('Apple authenticate error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}