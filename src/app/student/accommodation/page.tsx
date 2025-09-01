"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { loadStudent, saveStudent } from "@/utils/auth";
import type { StudentProfile, Payment } from "@/types";
import { Home, DoorOpen, Check, AlertTriangle } from "lucide-react";

type Gender = "male" | "female";

type Occupant = {
  id: string; // matricNumber
  name: string;
  gender: Gender;
};

type Room = {
  id: string;
  name: string;
  capacity: number;
  price: number;
  gender: Gender;
  occupants: Occupant[];
};

type Hostel = {
  id: string;
  name: string;
  gender: Gender;
  rooms: Room[];
};

const HOSTELS_KEY = "hostelsData";
const STUDENTS_KEY = "studentProfiles";

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div
      className="h-2 rounded-full bg-indigo-500"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

const naira = (n: number) =>
  `₦${(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function StudentAccommodationPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [method, setMethod] = useState<string>("card");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const s = loadStudent();
    setStudent(s || null);

    const raw = localStorage.getItem(HOSTELS_KEY);
    if (raw) {
      try {
        setHostels(JSON.parse(raw) as Hostel[]);
      } catch {
        setHostels([]);
      }
    }
  }, []);

  const eligibleHostels = useMemo(() => {
    if (!student?.gender) return [];
    return hostels.filter(h => h.gender === student.gender);
  }, [hostels, student?.gender]);

  const availableRooms = useMemo(() => {
    if (!selectedHostel) return [];
    return selectedHostel.rooms.filter(r => r.occupants.length < r.capacity);
  }, [selectedHostel]);

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accommodation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <p>Please log in as a student to access accommodation.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student.gender) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accommodation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <p>Please update your profile with your gender to see eligible hostels.</p>
            </div>
            <a href="/student/profile/edit">
              <Button>Update Profile</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const alreadyAllocated = Boolean(student.hostel);

  const startBooking = (room: Room) => {
    setSelectedRoom(room);
    setMethod("card");
    setPayOpen(true);
  };

  const confirmAndPay = () => {
    if (!student || !selectedHostel || !selectedRoom) return;
    setProcessing(true);

    try {
      const raw = localStorage.getItem(HOSTELS_KEY);
      const all: Hostel[] = raw ? JSON.parse(raw) : [];

      const hIndex = all.findIndex(h => h.id === selectedHostel.id);
      const roomIndex = all[hIndex].rooms.findIndex(r => r.id === selectedRoom.id);
      const room = all[hIndex].rooms[roomIndex];

      if (room.occupants.length >= room.capacity) {
        throw new Error("Room is already full");
      }

      const occ: Occupant = {
        id: student.matricNumber,
        name: student.fullName,
        gender: student.gender as Gender,
      };

      const updatedRoom = { ...room, occupants: [...room.occupants, occ] };
      all[hIndex].rooms[roomIndex] = updatedRoom;
      localStorage.setItem(HOSTELS_KEY, JSON.stringify(all));

      const paymentRecord: Payment = {
        id: crypto.randomUUID(),
        type: "Hostel",
        amount: room.price,
        date: new Date().toISOString(),
        status: "Paid",
      };

      const newStudent: StudentProfile = {
        ...student,
        hostel: all[hIndex].name,
        payments: [...(student.payments || []), paymentRecord],
      };

      saveStudent(newStudent);
      setStudent(newStudent);

      const listRaw = localStorage.getItem(STUDENTS_KEY);
      if (listRaw) {
        try {
          const list: StudentProfile[] = JSON.parse(listRaw);
          const idx = list.findIndex(s => s.matricNumber === student.matricNumber);
          if (idx !== -1) {
            list[idx] = newStudent;
            localStorage.setItem(STUDENTS_KEY, JSON.stringify(list));
          }
        } catch {
          // ignore
        }
      }

      setProcessing(false);
      setPayOpen(false);
      toast.success(`Payment successful. Room booked in ${all[hIndex].name} — ${updatedRoom.name}`);
    } catch (err) {
      setProcessing(false);
      toast.error(err instanceof Error ? err.message : "Could not complete booking");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <Home className="w-6 h-6" />
          Student Accommodation
        </h1>
        {alreadyAllocated && (
          <Badge variant="secondary" className="text-green-700 bg-green-100 border border-green-200">
            <Check className="w-4 h-4 mr-1" /> Allocated: {student.hostel}
          </Badge>
        )}
      </div>

      {/* Hostels */}
      <Card>
        <CardHeader>
          <CardTitle>Hostels for {student.gender}</CardTitle>
        </CardHeader>
        <CardContent>
          {eligibleHostels.length === 0 ? (
            <p>No hostels available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eligibleHostels.map(h => {
                const occ = h.rooms.reduce((s, r) => s + r.occupants.length, 0);
                const cap = h.rooms.reduce((s, r) => s + r.capacity, 0);
                const pct = cap ? Math.round((occ / cap) * 100) : 0;
                return (
                  <Card key={h.id}>
                    <CardHeader className="pb-2 flex justify-between">
                      <CardTitle>{h.name}</CardTitle>
                      <Badge>{h.gender}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p>{occ}/{cap} occupants</p>
                      <ProgressBar value={pct} />
                      <Button
                        className="w-full mt-2"
                        onClick={() => setSelectedHostel(h)}
                        disabled={alreadyAllocated}
                      >
                        <DoorOpen className="w-4 h-4 mr-2" /> View Rooms
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rooms Dialog */}
      <Dialog open={!!selectedHostel} onOpenChange={() => setSelectedHostel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedHostel?.name} — Rooms</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            {availableRooms.map(r => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle>{r.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{r.occupants.length}/{r.capacity} occupied</p>
                  <p>{naira(r.price)}</p>
                  <Button className="w-full mt-2" onClick={() => startBooking(r)} disabled={alreadyAllocated}>
                    Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={payOpen} onOpenChange={() => !processing && setPayOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <>
              <p>Hostel: {selectedHostel?.name}</p>
              <p>Room: {selectedRoom.name}</p>
              <p>Amount: {naira(selectedRoom.price)}</p>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button onClick={confirmAndPay} disabled={processing}>
              {processing ? "Processing..." : "Confirm & Pay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
