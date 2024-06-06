// middleware/authMiddleware.ts

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'next-auth/react'

export async function authMiddleware(req) {
  const session = await getSession({ req })

  if (!session) {
    return NextResponse.redirect('/login')
  }

  return NextResponse.next()
}
