import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Authcb minimal test hit!', { url: request.url });
  return NextResponse.json({ status: 'Authcb test route works!' });
}