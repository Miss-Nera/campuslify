"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, EventProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const EVENTS_KEY = "calendarEvents";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: "food" | "health" | "exams" | "general";
}

const localizer = momentLocalizer(moment);

export default function StudentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) {
      try {
        const parsed: CalendarEvent[] = JSON.parse(stored);
        setEvents(
          parsed.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
      } catch (err) {
        console.error("Failed to load events for student", err);
      }
    }
  }, []);

  // 🎨 Custom styling per event category
  const eventStyleGetter = (event: CalendarEvent) => {
    let bg = "bg-indigo-500"; // default
    if (event.category === "food") bg = "bg-green-500";
    if (event.category === "health") bg = "bg-red-500";
    if (event.category === "exams") bg = "bg-yellow-500";
    if (event.category === "general") bg = "bg-blue-500";

    return {
      className: `${bg} text-white rounded-md px-2 py-1 shadow-sm`,
      style: {
        border: "none",
        display: "block",
      },
    };
  };

  // Custom rendering for event content
  const EventComponent = ({ event }: EventProps<CalendarEvent>) => (
    <span className="font-medium">{event.title}</span>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Student Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-500 italic">No events available yet.</p>
      ) : (
        <div className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-900">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent,
            }}
          />
        </div>
      )}
    </div>
  );
}
