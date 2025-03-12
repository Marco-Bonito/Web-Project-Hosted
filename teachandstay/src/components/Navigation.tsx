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
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        {/* Altri link di navigazione */}
      </nav>
      <div className={styles.authButtons}>
        <Link href="/login">
          <button>Login</button>
        </Link>
        <Link href="/register">
          <button>Registrazione</button>
        </Link>
      </div>
    </header>
  );
}
