'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';

export default function RegisterPage() {
  // Stato per i campi della registrazione
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'host' | 'teacher'>('host');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cognome, email, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Registrazione fallita');
      } else {
        // Registrazione completata, reindirizza alla dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Errore di rete');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrazione</h1>
      <form onSubmit={handleRegister} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Nome:
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={styles.input}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Cognome:
            <input
              type="text"
              required
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              className={styles.input}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
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
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Registrati come:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'host' | 'teacher')}
              className={styles.select}
            >
              <option value="host">Host</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
        </div>
        <button type="submit" className={styles.button}>
          Registrati
        </button>
      </form>
    </div>
  );
}
