import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment variables')
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ['/email', '/dashboard', '/profile']

  if (protectedRoutes.includes(path)) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      console.log(`No auth token found, redirecting to / from ${path}`)
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      // Verify the token
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      console.log(`Auth token verified, allowing access to ${path}`)
      return NextResponse.next()
    } catch (error) {
      console.error('Invalid auth token:', error)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/email', '/dashboard', '/profile'],
}

