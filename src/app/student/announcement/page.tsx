"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Announcement = {
  id: number;
  title: string;
  message: string;
  date: string;
  category: string;
};

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("announcements");
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        📢 Announcements
      </h1>

      {announcements.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No announcements at the moment.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              className="shadow-sm hover:shadow-md transition"
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{ann.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ann.date).toDateString()}
                  </p>
                </div>
                <Badge variant="outline">{ann.category}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {ann.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
