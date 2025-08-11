"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { HostelRoom, StudentProfile } from "@/types";

type Props = {
  room: HostelRoom;
  students: StudentProfile[];
};

export default function RoomCard({ room, students }: Props) {
  const occupantProfiles = students.filter(s => room.occupants.includes(s.id));

  return (
    <Card className="w-full shadow-md border rounded-xl">
      <CardHeader>
        <h2 className="text-lg font-bold">{room.name}</h2>
        <p className="text-sm text-muted-foreground">
          Capacity: {room.capacity} | Occupied: {room.occupants.length}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="text-sm">
          {occupantProfiles.map((student) => (
            <li key={student.id}>
              {student.fullName} ({student.matricNumber})
            </li>
          ))}
        </ul>
        {room.occupants.length >= room.capacity && (
          <p className="mt-2 text-red-500 text-xs">Room is full</p>
        )}
      </CardContent>
    </Card>
  );
}
