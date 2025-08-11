"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type CalendarEvent = {
  id: string;
  title: string;
  date: string; // e.g. "2025-10-01"
  description: string;
};

export default function AcademicCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const storedEvents: CalendarEvent[] = JSON.parse(
      localStorage.getItem("calendarEvents") || "[]"
    );
    setEvents(storedEvents);
  }, []);

  const today = new Date();

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter((event) => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="w-full p-6 space-y-10">
      {/* Header */}
      <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold">📅 Academic Calendar</h1>
          <p className="text-sm mt-2">
            Stay updated with upcoming academic events and review past ones.
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-indigo-600">
          Upcoming Events
        </h2>
        <Separator className="mb-4" />
        {upcomingEvents.length > 0 ? (
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const isToday =
                  new Date(event.date).toDateString() === today.toDateString();
                return (
                  <Card key={event.id} className="shadow-sm">
                    <CardHeader
                      className={`font-semibold ${
                        isToday ? "text-green-600" : "text-indigo-700"
                      }`}
                    >
                      {event.title}
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`text-sm ${
                          isToday ? "text-green-600 font-bold" : "text-gray-600"
                        }`}
                      >
                        <strong>Date:</strong>{" "}
                        {new Date(event.date).toLocaleDateString()}
                        {isToday && " (Today)"}
                      </p>
                      <p className="text-sm mt-2">{event.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-sm text-center">
            🎉 No upcoming events. Stay tuned!
          </p>
        )}
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-indigo-600">
          Past Events
        </h2>
        <Separator className="mb-4" />
        {pastEvents.length > 0 ? (
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <Card key={event.id} className="shadow-sm">
                  <CardHeader className="font-semibold text-gray-700">
                    {event.title}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-sm text-center">
            📌 No past events recorded.
          </p>
        )}
      </section>
    </main>
  );
}
