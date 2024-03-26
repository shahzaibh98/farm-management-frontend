import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import { formatTime } from '../utils/common/function';

const events = [
  { title: 'Meeting', start: new Date() },
  { title: 'event 1', date: '2024-03-01' },
  { title: 'event 2', date: '2024-04-02' },
  { title: 'event 3', date: '2024-03-01T10:00:00' }, // Event 1 starts at 10:00 AM
  { title: 'event 4', date: '2024-04-02T15:30:00' }, // Event 2 starts at 3:30 PM
];

export function EventCalendar() {
  return (
    <div className="w-[750px] h-[500px] p-4">
      <FullCalendar
        headerToolbar={{
          start: 'prev next',
          end: 'dayGridWeek dayGridMonth',
        }}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        views={['dayGridMonth', 'dayGridWeek'] as any}
        events={events}
        eventContent={renderEventContent}
      />
    </div>
  );
}

// a custom render function
function renderEventContent(eventInfo: {
  timeText: string;
  event: {
    title:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | null
      | undefined;
  };
}) {
  return (
    <div className="h-8">
      {eventInfo.event.title}
      {formatTime(eventInfo.timeText)}
    </div>
  );
}
