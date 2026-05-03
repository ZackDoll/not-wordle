import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

function loadWords(): string[] {
  const text = readFileSync(join(process.cwd(), 'public', 'valid_words.txt'), 'utf-8');
  return text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length === 5);
}

export async function GET() {
  const words = loadWords();
  const word = words[Math.floor(Math.random() * words.length)];
  return NextResponse.json({ word });
}
