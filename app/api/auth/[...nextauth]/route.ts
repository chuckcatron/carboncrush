import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

const handler = NextAuth(authOptions);

export async function GET(request: NextRequest, context: { params: { nextauth: string[] } }) {
  return handler(request, context);
}

export async function POST(request: NextRequest, context: { params: { nextauth: string[] } }) {
  return handler(request, context);
}