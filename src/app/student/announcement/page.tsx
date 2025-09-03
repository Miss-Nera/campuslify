"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: string;
  title: string;
  message: string;
  category: string;
  audience: string; // e.g., "All", "300 level"
  image?: string;
  date: string;
}

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("announcements");
    if (stored) {
      try {
        setAnnouncements(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing announcements:", error);
      }
    }
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📢 Announcements</h1>

      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{announcement.title}</CardTitle>
                  <Badge variant="outline">{announcement.category}</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(announcement.date).toLocaleDateString()} •{" "}
                  {announcement.audience}
                </p>
              </CardHeader>
              <CardContent>
                {announcement.image && (
                  <div className="mb-3">
                    <Image
                      src={announcement.image}
                      alt="announcement"
                      width={500}
                      height={300}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <p className="text-gray-700">{announcement.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
