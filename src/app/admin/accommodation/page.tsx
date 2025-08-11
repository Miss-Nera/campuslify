"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { HostelRoom } from "@/types";

const HOSTEL_ROOMS_KEY = "hostelRooms";

export default function AdminHostelPage() {
  const [rooms, setRooms] = useState<HostelRoom[]>([]);

  // Load rooms from localStorage
  useEffect(() => {
    const savedRooms = localStorage.getItem(HOSTEL_ROOMS_KEY);
    if (savedRooms) {
      const parsed = JSON.parse(savedRooms).map((room: HostelRoom) => ({
        ...room,
        status: room.status || "available", // ✅ ensure default
      }));
      setRooms(parsed);
    } else {
      // Example seed data if no rooms exist yet
      const defaultRooms: HostelRoom[] = [
        {
          id: "1",
          name: "Room A1",
          capacity: 4,
          occupants: [],
          roomNumber: "A1",
          status: "available",
          students: "",
        },
        {
          id: "2",
          name: "Room A2",
          capacity: 3,
          occupants: [],
          roomNumber: "A2",
          status: "maintenance",
          students: "",
        },
      ];
      setRooms(defaultRooms);
      localStorage.setItem(HOSTEL_ROOMS_KEY, JSON.stringify(defaultRooms));
    }
  }, []);

  // Save rooms to localStorage
  const saveRooms = (updatedRooms: HostelRoom[]) => {
    setRooms(updatedRooms);
    localStorage.setItem(HOSTEL_ROOMS_KEY, JSON.stringify(updatedRooms));
  };

  // Update room status
  const updateRoomStatus = (id: string, newStatus: HostelRoom["status"]) => {
    const updatedRooms = rooms.map((room) =>
      room.id === id ? { ...room, status: newStatus } : room
    );
    saveRooms(updatedRooms);
    toast.success(`Room status updated to "${newStatus}"`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Hostel Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-lg p-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <p>Capacity: {room.capacity}</p>
              <p>Occupants: {room.occupants.length}</p>
              <p>Room Number: {room.roomNumber}</p>

              {/* Status Badge */}
              <Badge
                variant={
                  room.status === "available"
                    ? "success"
                    : room.status === "occupied"
                    ? "destructive"
                    : "secondary"
                }
                className="mt-2"
              >
                {room.status?.toUpperCase() || "UNKNOWN"}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRoomStatus(room.id, "available")}
              >
                Mark Available
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRoomStatus(room.id, "occupied")}
              >
                Mark Occupied
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRoomStatus(room.id, "maintenance")}
              >
                Maintenance
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
