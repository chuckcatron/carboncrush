import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    message: 'Test update endpoint working',
    timestamp: new Date().toISOString() 
  });
}