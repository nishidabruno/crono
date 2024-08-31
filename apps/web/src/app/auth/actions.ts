'use server'

import { env } from '@crono/env'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const googleSignInURL = new URL(
    'o/oauth2/v2/auth',
    'https://accounts.google.com/',
  )

  googleSignInURL.searchParams.set('response_type', 'code')
  googleSignInURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
  googleSignInURL.searchParams.set(
    'redirect_uri',
    env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
  )
  googleSignInURL.searchParams.set('scope', env.GOOGLE_OAUTH_SCOPE)

  redirect(googleSignInURL.toString())
}
