import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logAuthEvent } from '@/lib/oauth-client'

/**
 * YouTube OAuth Callback Handler
 * Exchanges authorization code for access token
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    await cookieStore.delete('youtube_auth_state')

    const sessionCookie = cookieStore.get('sonicflow_session')?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No valid session found' },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie)

    if (session.provider !== 'youtube') {
      return NextResponse.json(
        { error: 'Incorrect provider for this callback' },
        { status: 400 }
      )
    }

    logAuthEvent('login', {
      provider: 'youtube',
      action: 'callback_received',
    })

    // Store the authorization code in the session
    session.authCode = code
    cookieStore.set('sonicflow_session', JSON.stringify(session))

    return NextResponse.redirect(new URL('/library', request.url))
  } catch (error) {
    console.error('YouTube callback error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}