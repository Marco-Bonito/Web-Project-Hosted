// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [role, setRole] = useState<'host' | 'teacher'>('host');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gestisci la registrazione qui
    router.push('/dashboard');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Registrazione</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>
            Nome:
            <input type="text" required />
          </label>
        </div>
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
            Registrati come:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'host' | 'teacher')}
            >
              <option value="host">Host</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
        </div>
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}
