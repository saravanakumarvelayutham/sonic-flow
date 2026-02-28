/**
 * Background Job Registration API
 * Registers periodic auth cleanup jobs
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { authBackgroundTask } from '@/lib/oauth-client'

export async function POST() {
  try {
    // Register cleanup jobs for each provider
    const providers = ['apple', 'youtube', 'amazon'] as const

    for (const provider of providers) {
      // Execute session cleanup
      await authBackgroundTask(`cleanup-${provider}`, () => cleanupProviderSessions(provider))
    }

    return NextResponse.json({
      success: true,
      registeredJobs: providers.length,
      message: 'Auth background jobs registered successfully',
    })
  } catch (error) {
    console.error('Failed to register background jobs:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register background jobs',
      },
      { status: 500 }
    )
  }
}

async function cleanupProviderSessions(provider: string): Promise<void> {
  const cookieStore = await cookies()
  const cookieName = `${provider}_auth_state`

  const stateCookie = cookieStore.get(cookieName)

  if (stateCookie) {
    // Validate state
    const stateData = new Map<string, string>()
    stateCookie.value.split('&').forEach(param => {
      const [key, value] = param.split('=')
      if (key && value) {
        stateData.set(key, decodeURIComponent(value))
      }
    })

    const timestamp = parseInt(stateData.get('timestamp') || '0')
    const now = Date.now()

    // Cleanup stale states (older than 24 hours)
    if (now - timestamp > 24 * 60 * 60 * 1000) {
      cookieStore.delete(cookieName)
      console.log(`Cleanup: Stale auth state removed for ${provider}`)
    }
  }
}