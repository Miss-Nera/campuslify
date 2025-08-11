"use client";

import { useEffect, useState } from "react";
import { getHostelRooms, getStudents } from "@/lib/storage";
import { HostelRoom, StudentProfile } from "@/types";
import RoomCard from "@/components/RoomCard";

export default function HostelAdminPage() {
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    const storedRooms = getHostelRooms();
    const storedStudents = getStudents();
    setRooms(storedRooms);
    setStudents(storedStudents);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hostel Room Assignments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} students={students} />
        ))}
      </div>
    </div>
  );
}
