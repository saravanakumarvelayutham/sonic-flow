'use server'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// GET - Retrieve user preferences
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('sonicflow_session')?.value

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No authenticated session' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(session)
    const preferences = sessionData.preferences || {}

    return NextResponse.json({
      success: true,
      preferences,
    })
  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get preferences' },
      { status: 500 }
    )
  }
}

// PUT - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const cookieStore = await cookies()
    const sessionData = cookieStore.get('sonicflow_session')?.value

    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'No authenticated session' },
        { status: 401 }
      )
    }

    // Parse existing session
    let session = JSON.parse(sessionData)

    // Update preferences
    session.preferences = {
      ...session.preferences,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    // Re-set cookie
    cookieStore.set('sonicflow_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return NextResponse.json({
      success: true,
      preferences: session.preferences,
    })
  } catch (error) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}

// POST - Handle welcome step
export async function POST(request: NextRequest) {
  try {
    const { step } = await request.json()
    const cookieStore = await cookies()
    const sessionData = cookieStore.get('sonicflow_session')?.value

    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'No authenticated session' },
        { status: 401 }
      )
    }

    let session = JSON.parse(sessionData)

    // Update welcome step
    session.welcomeStep = step
    session.updatedAt = new Date().toISOString()

    cookieStore.set('sonicflow_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return NextResponse.json({
      success: true,
      welcomeStep: step,
    })
  } catch (error) {
    console.error('Handle welcome step error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update welcome step' },
      { status: 500 }
    )
  }
}