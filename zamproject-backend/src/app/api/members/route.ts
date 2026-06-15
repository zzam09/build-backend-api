// src/app/api/members/route.ts
// GET /api/members — placeholder, full implementation coming soon

import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    message: 'members — coming soon'
  })
}
