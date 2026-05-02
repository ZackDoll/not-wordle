import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { word: string } }) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${params.word.toLowerCase()}`,
    { next: { revalidate: 86400 } }
  );

  if (res.status === 404) return NextResponse.json({ notFound: true }, { status: 404 });
  if (!res.ok) return NextResponse.json({ error: 'upstream error' }, { status: 502 });

  const data = await res.json();
  return NextResponse.json(data);
}
