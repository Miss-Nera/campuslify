"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Hostel } from "@/types";

type StudentProfile = {
  id: string;
  fullName: string;
  matricNumber: string;
  gender: string;
  hostel?: string;
};

// ✅ Safe JSON parser
function safeParse<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);

    // Ensure type consistency
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export default function StudentHostelBooking() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    setHostels(safeParse<Hostel[]>("hostels", []));
    setStudent(safeParse<StudentProfile | null>("studentProfile", null)); // ✅ allows null
    setAllStudents(safeParse<StudentProfile[]>("allStudents", []));
  }, []);

  const saveAllStudents = (updated: StudentProfile[]) => {
    setAllStudents(updated);
    localStorage.setItem("allStudents", JSON.stringify(updated));
  };

  const handleBookHostel = (hostelId: string) => {
    if (!student) {
      toast.error("Please log in to book a hostel.");
      return;
    }

    if (student.hostel) {
      toast.error(`You have already booked ${student.hostel}.`);
      return;
    }

    const hostel = hostels.find((h) => h.id === hostelId);
    if (!hostel) return;

    // Gender restriction
    if (hostel.gender !== student.gender) {
      toast.error(`This hostel is for ${hostel.gender} students only.`);
      return;
    }

    // Count occupancy
    const occupied = allStudents.filter((s) => s.hostel === hostel.name).length;
    if (occupied >= hostel.capacity) {
      toast.error("Sorry, this hostel is already full.");
      return;
    }

    // Assign hostel
    const updatedStudent = { ...student, hostel: hostel.name };
    setStudent(updatedStudent);
    localStorage.setItem("studentProfile", JSON.stringify(updatedStudent));

    const updatedAllStudents = allStudents.map((s) =>
      s.id === updatedStudent.id ? updatedStudent : s
    );
    saveAllStudents(updatedAllStudents);

    toast.success(`You have successfully booked ${hostel.name}!`);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">🏠 Book a Hostel</h1>

      {hostels.length > 0 ? (
        <div className="space-y-4">
          {hostels.map((hostel) => {
            const occupied = allStudents.filter((s) => s.hostel === hostel.name).length;
            const available = hostel.capacity - occupied;

            return (
              <Card key={hostel.id} className="shadow-sm p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{hostel.name}</p>
                    <p className="text-sm text-gray-600">
                      Capacity: {hostel.capacity} | Occupied: {occupied} | Available: {available}
                    </p>
                    <p className="text-sm capitalize">Gender: {hostel.gender}</p>
                  </div>
                  <Button
                    disabled={available === 0 || !!student?.hostel}
                    onClick={() => handleBookHostel(hostel.id)}
                  >
                    {available === 0 ? "Full" : student?.hostel ? "Already Booked" : "Book"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No hostels available at the moment.</p>
      )}
    </main>
  );
}
