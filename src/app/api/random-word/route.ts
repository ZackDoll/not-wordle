import { NextResponse } from 'next/server';

const FALLBACK = 'CRANE';

export async function GET() {
  try {
    const res = await fetch('https://random-word-api.vercel.app/api?words=1&length=5', { cache: 'no-store' });
    const [word]: string[] = await res.json();
    return NextResponse.json({ word: word.toUpperCase() });
  } catch {
    return NextResponse.json({ word: FALLBACK });
  }
}
