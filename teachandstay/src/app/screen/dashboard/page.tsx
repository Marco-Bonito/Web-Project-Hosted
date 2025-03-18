// src/app/dashboard/page.tsx
'use client';

import Calendar from '@/components/Calendar';
import EventsList from '@/components/EventsList';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  // Stato per il mese attuale.
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Simula la lista di eventi.
  const events = [
    { id: 1, title: 'Evento 1', date: '2025-03-10' },
    { id: 2, title: 'Evento 2', date: '2025-03-15' },
  ];

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    // Qui potresti anche filtrare gli eventi in base al mese.
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Dashboard</h1>
        {/* Icona per la pagina di messaggistica */}
        <Link href="/messaging">
          <img 
            src="/messaging-icon.svg" 
            alt="Messaggistica" 
            style={{ width: '40px', cursor: 'pointer' }} 
          />
        </Link>
      </header>

      <Calendar currentMonth={currentMonth} onMonthChange={handleMonthChange} events={events} />
      <EventsList 
        events={events.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() === currentMonth.getMonth() &&
            eventDate.getFullYear() === currentMonth.getFullYear()
          );
        })}
      />
    </div>
  );
}
