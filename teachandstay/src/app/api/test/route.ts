// src/app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.json({ message: 'Ciao dal backend!' });
  response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate');
  return response;
}
