import Image from "next/image";

// src/app/page.tsx
export const revalidate = 60; // La pagina verrà rigenerata ogni 60 secondi

export default function HomePage() {
  // Logica per ottenere dati (possibilmente da un'API esterna o database)
  return (
    <main>
      <h1>Benvenuto su TeachAndStay!</h1>
      {/* Resto della pagina */}
    </main>
  );
}
