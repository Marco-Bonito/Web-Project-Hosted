// src/components/Calendar.tsx
import { useMemo } from 'react';

interface CalendarProps {
  currentMonth: Date;
  events: { id: number; title: string; date: string }[];
  onMonthChange: (newMonth: Date) => void;
}

export default function Calendar({ currentMonth, events, onMonthChange }: CalendarProps) {
  // Calcola il primo giorno del mese
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  }, [currentMonth]);

  // Funzioni per cambiare mese
  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    onMonthChange(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    onMonthChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handlePrevMonth}>{'<'}</button>
        <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth}>{'>'}</button>
      </div>
      {/* Qui potresti creare una griglia per mostrare i giorni e evidenziare quelli con eventi */}
      <div>
        {/* Esempio: elenca il numero dei giorni (semplice placeholder) */}
        {Array.from({ length: 31 }, (_, i) => (
          <span key={i} style={{ margin: '0.5rem' }}>
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
