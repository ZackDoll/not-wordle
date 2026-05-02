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

async function fetchDefinition(word: string) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { next: { revalidate: 86400 } }
    );
    if (res.status === 404) return 'not-found' as const;
    if (!res.ok) return null;
    const data = await res.json();
    const entry = data[0];
    const meaning = entry?.meanings?.[0];
    const def = meaning?.definitions?.[0]?.definition;
    if (!def) return null;
    return {
      phonetic: entry?.phonetic as string | undefined,
      partOfSpeech: meaning?.partOfSpeech as string,
      definition: def as string,
    };
  } catch {
    return null;
  }
}

const getDailyWordWithDefinition = unstable_cache(
  async () => {
    const words = loadWords();
    const word = words[dayIndex() % words.length];
    const definition = await fetchDefinition(word);
    return { word, definition };
  },
  ['daily-word'],
  { revalidate: 86400 }
);

export async function GET() {
  const { word, definition } = await getDailyWordWithDefinition();
  return NextResponse.json({ word, definition });
}
