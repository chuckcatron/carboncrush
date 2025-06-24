import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET works' });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ 
    message: 'PATCH works', 
    body,
    timestamp: new Date().toISOString() 
  });
}