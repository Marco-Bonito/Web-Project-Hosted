// src/app/dashboard/page.tsx
'use client';

import Calendar from '@/components/Calendar';
import EventsList from '@/components/EventsList';
import { useState } from 'react';

export default function DashboardPage() {
  // Stato per il mese attuale. Potrebbe essere un oggetto Date o un formato personalizzato.
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Simula la lista di eventi. In seguito questi dati arriveranno dal backend.
  const events = [
    { id: 1, title: 'Evento 1', date: '2025-03-10' },
    { id: 2, title: 'Evento 2', date: '2025-03-15' },
  ];

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    // Qui potresti anche filtrare gli eventi in base al mese
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <Calendar currentMonth={currentMonth} onMonthChange={handleMonthChange} events={events} />
      <EventsList events={events.filter(/* Filtra in base al mese corrente */ (event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === currentMonth.getMonth() &&
          eventDate.getFullYear() === currentMonth.getFullYear()
        );
      })} />
    </div>
  );
}
