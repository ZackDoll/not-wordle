export interface Definition {
  phonetic?: string;
  meanings: Array<{ partOfSpeech: string; definition: string }>;
}

interface DictionaryEntry {
  phonetic?: string;
  meanings?: Array<{
    partOfSpeech?: string;
    definitions?: Array<{ definition?: string }>;
  }>;
}

export function parseDefinitionData(data: DictionaryEntry[]): Definition | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  const phonetic = data[0]?.phonetic;
  const byPos = new Map<string, string>();
  for (const entry of data) {
    for (const meaning of entry?.meanings ?? []) {
      const pos = meaning?.partOfSpeech;
      const def = meaning?.definitions?.[0]?.definition;
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
}

export async function fetchDefinition(word: string): Promise<Definition | null | 'not-found'> {
  try {
    const res = await fetch(`/api/definition/${word.toLowerCase()}`);
    if (res.status === 404) return 'not-found';
    if (!res.ok) return null;
    const data = await res.json() as DictionaryEntry[];
    return parseDefinitionData(data) ?? null;
  } catch {
    return null;
  }
}
