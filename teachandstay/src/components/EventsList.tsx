// src/components/EventsList.tsx
interface Event {
    id: number;
    title: string;
    date: string;
  }
  
  interface EventsListProps {
    events: Event[];
  }
  
  export default function EventsList({ events }: EventsListProps) {
    return (
      <div>
        <h3>Eventi del mese</h3>
        {events.length === 0 ? (
          <p>Nessun evento programmato.</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                {event.date}: {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  