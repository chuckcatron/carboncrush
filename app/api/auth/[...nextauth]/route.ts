import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { NextRequest } from "next/server";

// Create handler function that properly handles the request context
function handler(req: NextRequest, context: { params: { nextauth: string[] } }) {
  return NextAuth(req as any, context as any, authOptions);
}

export { handler as GET, handler as POST };