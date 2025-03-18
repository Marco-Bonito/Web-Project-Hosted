// src/components/Navigation.tsx
import Link from 'next/link';
import styles from './Navigation.module.css'; // usa CSS modules o il metodo che preferisci

export default function Navigation() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">TeachAndStay</Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/screen/about">About</Link>
        <Link href="/screen/services">Services</Link>
        {/* Altri link di navigazione */}
      </nav>
      <div className={styles.authButtons}>
        <Link href="/screen/login">
          <button>Login</button>
        </Link>
        <Link href="/screen/register">
          <button>Registrazione</button>
        </Link>
      </div>
    </header>
  );
}
