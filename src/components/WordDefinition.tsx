import type { Definition } from '@/utils/dictionary';
import styles from './WordDefinition.module.css';

export default function WordDefinition({ definition }: { definition: Definition | null | 'not-found' }) {
  if (!definition) return null;
  if (definition === 'not-found') {
    return <p className={styles.notFound}>This word exists in Wordle&apos;s vocabulary but has no entry in the dictionary API</p>;
  }

  return (
    <div className={styles.container}>
      {definition.phonetic && <p className={styles.phonetic}>{definition.phonetic}</p>}
      <p className={styles.partOfSpeech}>{definition.partOfSpeech}</p>
      <p className={styles.definition}>{definition.definition}</p>
    </div>
  );
}
