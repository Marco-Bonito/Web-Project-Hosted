// src/components/Calendar.tsx
import React, { useState } from 'react';
import styles from './Calendar.module.css';

interface CalendarProps {
  currentMonth: Date;
  events?: { id: number; title: string; date: string }[];
  onMonthChange: (newMonth: Date) => void;
}

const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const Calendar: React.FC<CalendarProps> = ({ currentMonth, events, onMonthChange }) => {
  // Stato per il drag in corso
  const [dragRange, setDragRange] = useState<{ start: number | null; end: number | null }>({
    start: null,
    end: null,
  });
  // Stato per la selezione finale (che rimane evidenziata)
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);

  // Calcola il primo giorno del mese e l'indice di partenza per le celle
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const startIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  // Creiamo un array di 42 celle (ipotetiche 6 righe x 7 colonne)
  const cells = Array(42).fill(null);
  for (let i = 0; i < daysInMonth; i++) {
    cells[startIndex + i] = i + 1;
  }

  // Calcola il numero di righe necessarie
  const lastDayIndex = startIndex + daysInMonth - 1;
  const lastRowIndex = Math.floor(lastDayIndex / 7);
  const totalRows = lastRowIndex + 1;

  // Determina l'intervallo da evidenziare: se il drag è in corso, usa dragRange, altrimenti usa selectedRange
  let range: { start: number; end: number } | null = null;
  if (dragRange.start !== null && dragRange.end !== null) {
    range = { start: Math.min(dragRange.start, dragRange.end), end: Math.max(dragRange.start, dragRange.end) };
  } else if (selectedRange) {
    range = selectedRange;
  }

  // Handler per il drag
  const handleDragStart = (cellIndex: number, event: React.DragEvent<HTMLTableCellElement>) => {
    // Nasconde l'immagine di trascinamento
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    // Inizia un nuovo drag: reset della selezione finale
    setSelectedRange(null);
    setDragRange({ start: cellIndex, end: cellIndex });
  };

  const handleDragEnter = (cellIndex: number) => {
    if (dragRange.start !== null) {
      setDragRange(prev => ({ ...prev, end: cellIndex }));
    }
  };

  const handleDragEnd = () => {
    if (dragRange.start !== null && dragRange.end !== null) {
      const start = Math.min(dragRange.start, dragRange.end);
      const end = Math.max(dragRange.start, dragRange.end);
      // Filtra le celle che hanno un valore (giorni validi)
      const highlightedCells = cells.slice(start, end + 1).filter(day => day !== null);
      console.log('Celle evidenziate:', highlightedCells);
      // Salva la selezione per mantenere l'evidenziazione
      setSelectedRange({ start, end });
    }
    // Reset dello stato di drag
    setDragRange({ start: null, end: null });
  };

  // Costruisce le righe della tabella
  const rows = [];
  for (let i = 0; i < totalRows; i++) {
    const rowCells = [];
    for (let j = 0; j < 7; j++) {
      const cellIndex = i * 7 + j;
      const dayNumber = cells[cellIndex];
      const isHighlighted = range !== null && cellIndex >= range.start && cellIndex <= range.end;
      rowCells.push(
        <td
          key={j}
          className={`${styles.calendarCell} ${isHighlighted ? styles.highlight : ''}`}
          draggable={true}
          onDragStart={(e) => handleDragStart(cellIndex, e)}
          onDragEnter={() => handleDragEnter(cellIndex)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => console.log('Cella cliccata:', cellIndex, dayNumber)}
        >
          {dayNumber || ''}
        </td>
      );
    }
    rows.push(<tr key={i}>{rowCells}</tr>);
  }

  return (
    <div>
      <div className={styles.monthNavigation}>
        <button onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
          {'<'}
        </button>
        <h2 style={{ margin: 0 }}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
          {'>'}
        </button>
      </div>

      <table className={styles.calendarTable}>
        <thead>
          <tr>
            {daysOfWeek.map((day, index) => (
              <th key={index} className={styles.calendarHeader}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
