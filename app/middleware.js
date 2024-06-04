// app/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the user is authenticated
  const userAuth = request.cookies.get('userAuth'); // Assuming you store the auth status in a cookie

  // Define the paths that require authentication
  const protectedPaths = ['/protected', '/another-protected-page'];

  // Get the current path
  const currentPath = request.nextUrl.pathname;

  if (protectedPaths.includes(currentPath) && userAuth !== 'true') {
    // If the user is not authenticated and trying to access a protected page, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected', '/another-protected-page'], // Specify the paths to match
};
