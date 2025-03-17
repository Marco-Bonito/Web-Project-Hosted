// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { nome, cognome, email, password, role } = await request.json();

    // Controlla se l'utente esiste già
    const existingUser = await prisma.utente.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email già registrata' }, { status: 400 });
    }

    // In produzione, assicurati di hashare la password prima di salvarla!
    const newUser = await prisma.utente.create({
      data: {
        nome,
        cognome,
        email,
        password, // Qui dovresti usare un hash della password in produzione
        tipologiaAbbonamento: 'base', // Puoi cambiare il valore di default in base alle tue esigenze
        tipologiaUtente: role,
      },
    });

    return NextResponse.json({ message: 'Registrazione completata con successo', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
