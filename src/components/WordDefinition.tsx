import type { Definition } from '@/utils/dictionary';
import styles from './WordDefinition.module.css';

export default function WordDefinition({ definition }: { definition: Definition | null }) {
  if (!definition) return null;

  return (
    <div className={styles.container}>
      {definition.phonetic && <p className={styles.phonetic}>{definition.phonetic}</p>}
      <p className={styles.partOfSpeech}>{definition.partOfSpeech}</p>
      <p className={styles.definition}>{definition.definition}</p>
    </div>
  );
}
