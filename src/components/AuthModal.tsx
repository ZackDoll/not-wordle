'use client';

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthModal.module.css';

export default function AuthModal({ onDismiss }: { onDismiss: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const { googleSignIn } = useAuth();

  async function handleSuccess(response: { credential?: string }) {
    if (!response.credential) return;
    try {
      await googleSignIn(response.credential);
      onDismiss();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  }

  return (
    <div className={styles.backdrop} onClick={onDismiss}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <h2 className={styles.heading}>sign in</h2>
        <p className={styles.sub}>your stats will be saved and you can appear on the leaderboard</p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.btnWrap}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Sign in failed')}
            theme="filled_black"
            shape="pill"
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
