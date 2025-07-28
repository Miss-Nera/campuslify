"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

type TimetableEntry = {
  id: string;
  courseCode: string;
  courseTitle: string;
  day: string; // e.g. "Monday"
  time: string; // e.g. "8:00 - 10:00 AM"
  venue: string;
};

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("studentTimetable");
    if (stored) {
      setTimetable(JSON.parse(stored));
    } else {
      // fallback sample data
      const sample: TimetableEntry[] = [
        {
          id: "1",
          courseCode: "CSC101",
          courseTitle: "Introduction to Computer Science",
          day: "Monday",
          time: "8:00 - 10:00 AM",
          venue: "Auditorium A",
        },
        {
          id: "2",
          courseCode: "MTH102",
          courseTitle: "Calculus II",
          day: "Monday",
          time: "10:00 - 12:00 PM",
          venue: "Room 204",
        },
        {
          id: "3",
          courseCode: "ENG201",
          courseTitle: "Technical Writing",
          day: "Wednesday",
          time: "9:00 - 11:00 AM",
          venue: "Room 305",
        },
      ];
      setTimetable(sample);
      localStorage.setItem("studentTimetable", JSON.stringify(sample));
    }
  }, []);

  // Group timetable by day
  const groupedByDay = timetable.reduce<Record<string, TimetableEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.day]) acc[entry.day] = [];
      acc[entry.day].push(entry);
      return acc;
    },
    {}
  );

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">
        📅 My Timetable
      </h1>

      {Object.keys(groupedByDay).length > 0 ? (
        Object.entries(groupedByDay).map(([day, entries]) => (
          <Card key={day} className="shadow-md">
            <CardHeader className="text-lg font-semibold text-indigo-600">
              {day}
            </CardHeader>
            <CardContent className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b pb-2 last:border-b-0"
                >
                  <p className="font-semibold">
                    {entry.courseCode} — {entry.courseTitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    {entry.time} | {entry.venue}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No timetable available yet.
        </p>
      )}
    </main>
  );
}
