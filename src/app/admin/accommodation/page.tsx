"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Payment, Hostel } from "@/types";

type Application = {
  studentId: string;
  studentName: string;
  hostelId: string;
  hostelName: string;
  status: "Pending Approval" | "Approved" | "Declined";
  date: string;
};

type StudentProfile = {
  id: string;
  fullName: string;
  matricNumber: string;
  department: string;
  level: string;
  email: string;
  gender: string;
  hostel?: string;
  dob: string;
  college: string;
  payments?: Payment[];
};

export default function AdminAccommodationPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [newHostel, setNewHostel] = useState({
    name: "",
    capacity: 0,
    gender: "male" as "male" | "female",
    availableBeds: 0,
  });

  useEffect(() => {
    const allApps: Application[] = JSON.parse(
      localStorage.getItem("accommodationApplications") || "[]"
    );
    setApplications(allApps);

    const storedHostels: Hostel[] = JSON.parse(
      localStorage.getItem("hostels") || "[]"
    );
    setHostels(storedHostels);
  }, []);

  const saveHostels = (updated: Hostel[]) => {
    setHostels(updated);
    localStorage.setItem("hostels", JSON.stringify(updated));
  };

  const handleAddHostel = () => {
    if (!newHostel.name || newHostel.capacity <= 0) {
      toast.error("Please fill all hostel details correctly.");
      return;
    }

    const hostel: Hostel = {
      id: Date.now().toString(),
      ...newHostel,
    };

    const updated = [...hostels, hostel];
    saveHostels(updated);

    toast.success("Hostel added successfully!");
    setNewHostel({ name: "", capacity: 0, gender: "male", availableBeds: 0 });
  };

  const handleDeleteHostel = (id: string) => {
    const updated = hostels.filter((h) => h.id !== id);
    saveHostels(updated);
    toast.success("Hostel deleted.");
  };

  const updateStatus = (index: number, status: "Approved" | "Declined") => {
    const updatedApps = [...applications];
    const app = updatedApps[index];
    app.status = status;
    setApplications(updatedApps);
    localStorage.setItem("accommodationApplications", JSON.stringify(updatedApps));

    if (status === "Approved") {
      // Update student profile with hostel
      const allProfiles: StudentProfile[] = JSON.parse(
        localStorage.getItem("studentProfiles") || "[]"
      );
      const profileIndex = allProfiles.findIndex(
        (student) => student.id === app.studentId
      );
      if (profileIndex !== -1) {
        allProfiles[profileIndex].hostel = app.hostelName;
        localStorage.setItem("studentProfiles", JSON.stringify(allProfiles));

        // Also update the single logged-in profile if needed
        const currentProfile: StudentProfile | null = JSON.parse(
          localStorage.getItem("studentProfile") || "null"
        );
        if (currentProfile && currentProfile.id === app.studentId) {
          currentProfile.hostel = app.hostelName;
          localStorage.setItem("studentProfile", JSON.stringify(currentProfile));
        }

        toast.success(`${app.studentName}'s hostel updated to ${app.hostelName}`);
      }
    }

    toast.success(`Application ${status.toLowerCase()} successfully!`);
  };

  return (
    <main className="max-w-6xl mx-auto p-6 mt-10 space-y-10">
      {/* Header */}
      <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold">Accommodation Management 🏠</h1>
          <p className="text-sm mt-2">
            Manage hostels and review student applications.
          </p>
        </CardContent>
      </Card>

      {/* Manage Hostels */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hostels</h2>
        <Card className="p-4 shadow-md mb-6">
          <CardHeader className="font-semibold">Add New Hostel</CardHeader>
          <CardContent className="grid gap-3">
            <div>
              <Label>Name</Label>
              <Input
                value={newHostel.name}
                onChange={(e) =>
                  setNewHostel({ ...newHostel, name: e.target.value })
                }
                placeholder="Enter hostel name"
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={newHostel.capacity}
                onChange={(e) =>
                  setNewHostel({
                    ...newHostel,
                    capacity: Number(e.target.value),
                    availableBeds: Number(e.target.value),
                  })
                }
                placeholder="Enter total capacity"
              />
            </div>
            <div>
              <Label>Gender</Label>
              <select
                className="border rounded p-2 w-full"
                value={newHostel.gender}
                onChange={(e) =>
                  setNewHostel({
                    ...newHostel,
                    gender: e.target.value as "male" | "female",
                  })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <Button onClick={handleAddHostel}>Add Hostel</Button>
          </CardContent>
        </Card>

        {hostels.length > 0 ? (
          <div className="space-y-4">
            {hostels.map((hostel) => (
              <Card key={hostel.id} className="shadow-sm p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{hostel.name}</p>
                    <p className="text-sm text-gray-600">
                      Capacity: {hostel.capacity} | Available:{" "}
                      {hostel.availableBeds}
                    </p>
                    <p className="text-sm capitalize">Gender: {hostel.gender}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteHostel(hostel.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hostels added yet.</p>
        )}
      </section>

      <Separator />

      {/* Manage Applications */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
        <Separator className="mb-4" />
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="font-semibold">
                  {app.studentName} — {app.hostelName}
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="text-sm">
                    <p>
                      <strong>Date:</strong> {app.date}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          app.status === "Approved"
                            ? "text-green-600 font-semibold"
                            : app.status === "Declined"
                            ? "text-red-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {app.status}
                      </span>
                    </p>
                  </div>
                  {app.status === "Pending Approval" && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        onClick={() => updateStatus(index, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateStatus(index, "Declined")}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No accommodation applications found.
          </p>
        )}
      </section>
    </main>
  );
}
