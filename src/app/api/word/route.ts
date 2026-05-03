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
    const data: any[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const phonetic = data[0]?.phonetic as string | undefined;
    const byPos = new Map<string, string>();
    for (const entry of data) {
      for (const meaning of entry?.meanings ?? []) {
        const pos = meaning?.partOfSpeech as string;
        const def = meaning?.definitions?.[0]?.definition as string;
        if (!pos || !def) continue;
        if (!byPos.has(pos) || def.length > byPos.get(pos)!.length) {
          byPos.set(pos, def);
        }
      }
    }
    const meanings = Array.from(byPos.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([partOfSpeech, definition]) => ({ partOfSpeech, definition }));
    if (meanings.length === 0) return null;
    return { phonetic, meanings };
  } catch {
    return null;
  }
}

const getDailyWordWithDefinition = unstable_cache(
  async (_dateStr: string) => {
    const words = loadWords();
    const word = words[dayIndex() % words.length];
    const definition = await fetchDefinition(word);
    return { word, definition };
  },
  ['daily-word'],
  { revalidate: 86400 }
);

export async function GET() {
  const dateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
  const { word, definition } = await getDailyWordWithDefinition(dateStr);
  return NextResponse.json({ word, definition });
}
