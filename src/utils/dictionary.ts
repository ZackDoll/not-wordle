export interface Definition {
  phonetic?: string;
  partOfSpeech: string;
  definition: string;
}

export async function fetchDefinition(word: string): Promise<Definition | null | 'not-found'> {
  try {
    const res = await fetch(`/api/definition/${word.toLowerCase()}`);
    if (res.status === 404) return 'not-found';
    if (!res.ok) return null;
    const data = await res.json();
    const entry = data[0];
    const meaning = entry?.meanings?.[0];
    const def = meaning?.definitions?.[0]?.definition;
    if (!def) return null;
    return {
      phonetic: entry?.phonetic,
      partOfSpeech: meaning?.partOfSpeech,
      definition: def,
    };
  } catch {
    return null;
  }
}
