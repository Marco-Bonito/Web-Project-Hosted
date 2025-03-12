// src/app/login/page.tsx
'use client'; // rende il componente client-side

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [role, setRole] = useState<'host' | 'teacher'>('host');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Qui gestirai la logica di autenticazione
    // Al termine del login, reindirizza alla dashboard
    router.push('/dashboard');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Email:
            <input type="email" required />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input type="password" required />
          </label>
        </div>
        <div>
          <label>
            Accedi come:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'host' | 'teacher')}
            >
              <option value="host">Host</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
