'use server'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logAuthEvent } from '@/lib/oauth-client'

/**
 * Amazon Logout Handler
 * Clears authentication cookies and sessions
 */

export async function POST() {
  try {
    // Invalidate session
    const cookieStore = await cookies()
    await cookieStore.delete('sonicflow_session')

    // Clear provider-specific auth cookies
    await cookieStore.delete('amazon_auth_state')

    // Log event
    await logAuthEvent('logout', {
      provider: 'amazon',
    })

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Amazon logout error:', error)

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