import { type NextRequest, NextResponse } from 'next/server'

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
  } else {
    response.cookies.delete('team')
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
