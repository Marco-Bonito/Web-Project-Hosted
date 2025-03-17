// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma
    
 } from '@/lib/prisma';
export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    // Cerca l'utente tramite email
    const user = await prisma.utente.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 401 });
    }

    // Confronta la password (in produzione, confronta l'hash)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Password errata' }, { status: 401 });
    }

    // Puoi aggiungere logica aggiuntiva per gestire il ruolo, se necessario

    // Se tutto va bene, ritorna una risposta di successo
    return NextResponse.json({ message: 'Login effettuato con successo' });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
