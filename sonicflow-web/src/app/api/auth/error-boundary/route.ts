/**
 * Auth Error Boundary API
 * Centralized error handling and logging for auth operations
 */
import { NextRequest, NextResponse } from 'next/server'
import { logAuthEvent } from '@/lib/oauth-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, error, code, details, context } = body

    // Log the error
    await logAuthEvent('error', {
      provider,
      code: code || 'AUTH_ERROR',
      message: error || 'Unknown auth error',
      details,
      context,
      timestamp: new Date().toISOString(),
    })

    // Return structured error response
    return NextResponse.json({
      success: true,
      error: {
        code: code || 'AUTH_ERROR',
        message: error || 'Authentication error occurred',
        provider,
        details,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log auth error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process error logging',
      },
      { status: 500 }
    )
  }
}