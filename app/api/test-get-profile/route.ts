import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({ 
      message: 'Test get-profile endpoint working',
      body,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}