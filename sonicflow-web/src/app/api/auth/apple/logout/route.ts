'use server'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAuthHeaders, logAuthEvent } from '@/lib/oauth-client'

/**
 * Apple Logout Handler
 * Clears authentication cookies and sessions
 */

export async function POST() {
  try {
    const authHeaders = await getAuthHeaders()

    // Invalidate session
    const cookieStore = await cookies()
    await cookieStore.delete('sonicflow_session')

    // Clear provider-specific auth cookies
    await cookieStore.delete('apple_auth_state')

    // Log event
    await logAuthEvent('logout', {
      provider: 'apple',
    })

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Apple logout error:', error)

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