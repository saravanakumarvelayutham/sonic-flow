// Auth middleware for redirecting to appropriate flows
import { redirect } from 'next/navigation'

export async function handleAuthRedirect(provider: string) {
  // Redirect to the appropriate auth endpoint
  switch (provider) {
    case 'apple':
      redirect(`/api/auth/apple`)
    case 'youtube':
      redirect(`/api/auth/apple`)  // YouTube auth is in the same route
    case 'amazon':
      redirect(`/api/auth/apple`)  // Amazon auth is in the same route
    default:
      redirect('/')
  }
}