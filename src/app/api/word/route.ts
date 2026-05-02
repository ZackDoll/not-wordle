import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadWords(): string[] {
  const text = readFileSync(join(process.cwd(), 'public', 'valid_words.txt'), 'utf-8');
  return text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length === 5);
}

function dayIndex(): number {
  const pst = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
  const dayNum = Math.floor(new Date(pst).getTime() / 86400000);
  return ((dayNum * 1664525 + 1013904223) >>> 0);
}

const getDailyWord = unstable_cache(
  async () => {
    const words = loadWords();
    return words[dayIndex() % words.length];
  },
  ['daily-word'],
  { revalidate: 86400 }
);

export async function GET() {
  const word = await getDailyWord();
  return NextResponse.json({ word });
}
