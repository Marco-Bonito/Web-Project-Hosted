// src/app/api/chats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { ownerId, partnerId } = await request.json();

    // Crea una nuova conversazione se non esiste già (logica opzionale)
    const conversation = await prisma.conversazione.create({
      data: {
        ownerId,
        partnerId,
      },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Errore nella creazione della conversazione:', error);
    return NextResponse.json({ error: 'Errore nella creazione della conversazione' }, { status: 500 });
  }
}

// Per recuperare le conversazioni di un utente, potresti anche implementare un GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Parametro userId mancante' }, { status: 400 });
  }
  try {
    const conversations = await prisma.conversazione.findMany({
      where: {
        OR: [
          { ownerId: Number(userId) },
          { partnerId: Number(userId) },
        ],
      },
      include: {
        messaggi: true,  // includi i messaggi se necessario
      },
    });
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Errore nel recupero delle conversazioni:', error);
    return NextResponse.json({ error: 'Errore nel recupero delle conversazioni' }, { status: 500 });
  }
}
