// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl
  
  // Get token from cookie - using the correct name 'tokenUser'
  const token = request.cookies.get('loginToken')?.value

  // Define public paths
  const isPublicPath = 
    pathname === '/' || 
    pathname.startsWith('/auth') ||
    pathname.startsWith('/testing')


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};