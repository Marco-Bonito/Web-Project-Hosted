// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { conversazioneId, utenteId, messaggio } = await request.json();

    // Crea un nuovo messaggio nella conversazione specificata
    const newMessage = await prisma.messaggio.create({
      data: {
        conversazioneId,
        utenteId,
        messaggio,
      },
    });

    return NextResponse.json({ newMessage });
  } catch (error) {
    console.error('Errore nella creazione del messaggio:', error);
    return NextResponse.json({ error: 'Errore nella creazione del messaggio' }, { status: 500 });
  }
}

// Per recuperare i messaggi di una conversazione, potresti implementare anche un GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  if (!conversationId) {
    return NextResponse.json({ error: 'Parametro conversationId mancante' }, { status: 400 });
  }
  try {
    const messages = await prisma.messaggio.findMany({
      where: { conversazioneId: Number(conversationId) },
      orderBy: { dataInvio: 'asc' },
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Errore nel recupero dei messaggi:', error);
    return NextResponse.json({ error: 'Errore nel recupero dei messaggi' }, { status: 500 });
  }
}
