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
  // Stato per la cella (giorno) selezionata, per aprire il dialog
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Calcola il primo giorno del mese e l'indice di partenza per le celle
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Domenica) ... 6 (Sabato)
  const startIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Per far partire la settimana da Lunedì
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

  // Handler per il click sulla cella: apre il dialog con i dettagli del giorno
  const handleCellClick = (cellIndex: number) => {
    const day = cells[cellIndex];
    if (day !== null) {
      setSelectedDay(day);
    }
  };

  // Costruzione delle righe della tabella
  const rows = [];
  for (let i = 0; i < totalRows; i++) {
    const rowCells = [];
    for (let j = 0; j < 7; j++) {
      const cellIndex = i * 7 + j;
      const dayNumber = cells[cellIndex];
      rowCells.push(
        <td
          key={j}
          className={styles.calendarCell}
          onClick={() => handleCellClick(cellIndex)}
        >
          {dayNumber || ''}
        </td>
      );
    }
    rows.push(<tr key={i}>{rowCells}</tr>);
  }

  // Handler per chiudere il dialog
  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  return (
    <div>
      {/* Navigazione per il mese, con i pulsanti vicini al nome del mese */}
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

      {/* Tabella del calendario */}
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

      {/* Dialog per i dettagli del giorno */}
      {selectedDay !== null && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Dettagli del giorno {selectedDay}</h3>
            <p>
              Qui puoi visualizzare ulteriori informazioni ed eventi del giorno {selectedDay}.
            </p>
            <button onClick={handleCloseModal}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
