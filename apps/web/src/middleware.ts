import { type NextRequest, NextResponse } from 'next/server'

// TODO: Fix safari bug where cookies does not change on switching teams.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const headers = new Headers(request.headers)
  headers.set('x-pathname', pathname)

  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  if (pathname.startsWith('/team')) {
    const [, , slug] = pathname.split('/')

    response.cookies.set('team', slug)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
