import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

const FALLBACK = 'CRANE';

const getDailyWord = unstable_cache(
  async () => {
    try {
      const res = await fetch('https://random-word-api.vercel.app/api?words=1&length=5');
      const [word]: string[] = await res.json();
      return word.toUpperCase();
    } catch {
      return FALLBACK;
    }
  },
  [new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })],
  { revalidate: 86400 }
);

export async function GET() {
  const word = await getDailyWord();
  return NextResponse.json({ word });
}
