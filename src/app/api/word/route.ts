import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadWords(): string[] {
  const text = readFileSync(join(process.cwd(), 'public', 'valid_words.txt'), 'utf-8');
  return text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length === 5);
}

function dateKey(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
}

const getDailyWord = unstable_cache(
  async () => {
    const words = loadWords();
    const key = dateKey();
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return words[hash % words.length];
  },
  ['daily-word'],
  { revalidate: 86400 }
);

export async function GET() {
  const word = await getDailyWord();
  return NextResponse.json({ word });
}
