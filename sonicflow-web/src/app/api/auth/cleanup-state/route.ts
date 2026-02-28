/**
 * Auth State Cleanup API
 * Immediately cleans up old/stale auth states
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { clearAuthCookies } from '@/lib/oauth-client'
import { logAuthEvent } from '@/lib/oauth-client'

export async function DELETE(request: NextRequest) {
  try {
    // Determine scope: all or specific providers
    const url = new URL(request.url)
    const providersParam = url.searchParams.get('providers')

    if (providersParam) {
      // Cleanup specific providers
      const providers = providersParam.split(',').map(p => p.trim())

      for (const provider of providers) {
        await clearAuthProviderCookies(provider)
        await logAuthEvent('logout', {
          provider,
          action: 'cleanup_stale_states',
          timestamp: new Date().toISOString(),
        })
      }

      return NextResponse.json({
        success: true,
        cleanedProviders: providers,
        message: `Cleaned up ${providers.length} provider(s)`,
      })
    } else {
      // Cleanup all providers
      await clearAuthCookies()

      await logAuthEvent('logout', {
        action: 'cleanup_all_stale_states',
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        cleanedProviders: ['apple', 'youtube', 'amazon'],
        message: 'Cleaned up all stale auth states',
      })
    }
  } catch (error) {
    console.error('Failed to cleanup auth states:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cleanup auth states',
      },
      { status: 500 }
    )
  }
}

async function clearAuthProviderCookies(provider: string): Promise<void> {
  const cookieStore = await cookies()
  const cookieNames = [
    `${provider}_auth_state`,
    `nonce_${provider}-`,
    `auth_provider_${provider}`,
  ]

  for (const cookieName of cookieNames) {
    cookieStore.delete(cookieName)
  }
}