'use client';

import { useState } from 'react';
import { signIn, useSession, SessionProvider } from 'next-auth/react';
import styles from './Login.module.css';

export default function LoginPage() {
  const [role, setRole] = useState<'host' | 'teacher'>('host');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role,
    });

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <SessionProvider session={session}>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Email:
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                data-testid="email-input"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Password:
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                data-testid="password-input"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Accedi come:
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'host' | 'teacher')}
                className={styles.select}
                data-testid="role-select"
              >
                <option value="host">Host</option>
                <option value="teacher">Teacher</option>
              </select>
            </label>
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </SessionProvider>
  );
}
