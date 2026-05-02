import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './StartPage.module.css';

const TITLE_TILES = [
  { letter: 'W', state: 'correct' },
  { letter: 'O', state: 'absent' },
  { letter: 'R', state: 'present' },
  { letter: 'D', state: 'correct' },
  { letter: 'L', state: 'present' },
  { letter: 'E', state: 'absent' },
  { letter: 'N', state: 'correct' },
  { letter: 'T', state: 'present' },
] as const;

type TileState = 'correct' | 'present' | 'absent' | 'empty';
type MiniTile = { letter: string; state: TileState };

const E = (l: string, s: TileState): MiniTile => ({ letter: l, state: s });
const _ = (l = ''): MiniTile => ({ letter: l, state: 'empty' });

const modes = [
  {
    title: 'Daily Word',
    description: 'One new puzzle every day. Come back tomorrow for a fresh word.',
    btn: 'Play',
    to: '/daily',
    available: true,
    color: '#16a34a',
    board: [
      [E('S','absent'), E('T','absent'), E('A','absent'), E('R','absent'), E('E','absent')],
      [E('C','present'), E('L','correct'), E('O','absent'), E('U','present'), E('D','absent')],
      [E('P','absent'), E('I','absent'), E('N','absent'), E('K','correct'), E('Y','correct')],
      [E('L','correct'), E('U','correct'), E('C','correct'), E('K','correct'), E('Y','correct')],
    ],
  },
  {
    title: 'Quick Play',
    description: 'A random word every game, playable any time. No waiting required.',
    btn: 'Play',
    to: '/play',
    available: true,
    color: '#ca8a04',
    board: [
      [E('C','absent'), E('R','absent'), E('A','present'), E('N','absent'), E('E','present')],
      [E('F','correct'), E('L','correct'), E('A','correct'), E('M','correct'), E('E','correct')],
      [_(), _(), _(), _(), _()],
      [_(), _(), _(), _(), _()],
    ],
  },
  {
    title: 'Custom Word',
    description: 'Pick your own word and send the link to a friend.',
    btn: 'Create',
    to: '/custom',
    available: true,
    color: '#7c3aed',
    board: [
      [E('C','absent'), E('R','present'), E('A','absent'), E('N','absent'), E('E','absent')],
      [E('T','absent'), E('H','absent'), E('O','correct'), E('R','correct'), E('N','absent')],
      [_(), _(), _(), _(), _()],
      [_(), _(), _(), _(), _()],
    ],
  },
];

export default function StartPage() {
  return (
    <main className={styles.page}>
      <div className={styles.titleTiles} aria-label="Wordlen't">
        {TITLE_TILES.map(({ letter, state }, i) => (
          <Fragment key={i}>
            {i === 7 && <span className={styles.apostrophe}>&apos;</span>}
            <div
              className={`${styles.tile} ${styles[state]}`}
              style={{ animationDelay: `${1 + i * 0.1}s` }}
            >{letter}</div>
          </Fragment>
        ))}
      </div>
      <p className={styles.subtitle}>Legally speaking, this is not Wordle</p>
      <p className={styles.subtitle}>(Why would you even assume that it is, it&apos;s nothing like Wordle)</p>
      <div className={styles.cards}>
        {modes.map(mode => (
          <div
            key={mode.title}
            className={`${styles.card}${mode.available ? '' : ` ${styles.cardDisabled}`}`}
            style={{ '--card-accent': mode.color } as React.CSSProperties}
          >
            <div className={styles.miniBoard}>
              {mode.board.map((row, ri) => (
                <div key={ri} className={styles.miniRow}>
                  {row.map((tile, ci) => (
                    <div key={ci} className={`${styles.miniTile} ${styles[tile.state]}`}>
                      {tile.letter}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <h2 className={styles.cardTitle}>{mode.title}</h2>
            <p className={styles.cardDesc}>{mode.description}</p>
            {mode.available ? (
              <Link to={mode.to} className={styles.btn}>{mode.btn}</Link>
            ) : (
              <span className={styles.badge}>coming soon</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
