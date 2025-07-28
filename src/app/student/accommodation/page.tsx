"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { StudentProfile, Hostel } from "@/types";

type Application = {
  studentId: string;
  studentName: string;
  hostelId: string;
  hostelName: string;
  status: "Pending Approval" | "Approved" | "Declined";
  date: string;
};

export default function StudentAccommodationPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("studentProfile");
    if (data) {
      const parsed: StudentProfile = JSON.parse(data);
      setProfile(parsed);

      const allApps: Application[] = JSON.parse(
        localStorage.getItem("accommodationApplications") || "[]"
      );
      setApplications(allApps.filter((app) => app.studentId === parsed.id));
    }

    const storedHostels: Hostel[] = JSON.parse(
      localStorage.getItem("hostels") || "[]"
    );
    setHostels(storedHostels);
  }, []);

  const handleApply = (hostel: Hostel) => {
    if (!profile) return;

    if (hostel.availableBeds <= 0) {
      toast.error("No available beds in this hostel.");
      return;
    }

    const newApp: Application = {
      studentId: profile.id,
      studentName: profile.fullName,
      hostelId: hostel.id,
      hostelName: hostel.name,
      status: "Pending Approval",
      date: new Date().toLocaleDateString(),
    };

    const allApps: Application[] = JSON.parse(
      localStorage.getItem("accommodationApplications") || "[]"
    );

    const alreadyApplied = allApps.some(
      (app) =>
        app.studentId === profile.id &&
        app.hostelId === hostel.id &&
        app.status === "Pending Approval"
    );
    if (alreadyApplied) {
      toast.error("You already have a pending application for this hostel.");
      return;
    }

    const updatedApps = [...allApps, newApp];
    localStorage.setItem("accommodationApplications", JSON.stringify(updatedApps));
    setApplications(updatedApps.filter((app) => app.studentId === profile.id));

    toast.success(`Applied successfully for ${hostel.name}`);
  };

  if (!profile) {
    return <p className="text-center text-gray-500 mt-10">Loading accommodation...</p>;
  }

  const availableHostels = hostels.filter((h) => h.gender === profile.gender);

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-8">
      {/* Welcome Header */}
      <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold">Hostel Accommodation 🏠</h1>
          <p className="text-sm mt-2">
            Welcome {profile.fullName.split(" ")[0]}! Choose a hostel suitable for you below.
          </p>
        </CardContent>
      </Card>

      {/* Available Hostels */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Available Hostels</h2>
        {availableHostels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableHostels.map((hostel) => (
              <Card key={hostel.id} className="shadow-md">
                <CardHeader className="font-semibold flex items-center justify-between">
                  <span>{hostel.name}</span>
                  <Users className="text-indigo-600" />
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    Capacity: {hostel.capacity} | Beds Available:{" "}
                    <span
                      className={
                        hostel.availableBeds > 0
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {hostel.availableBeds}
                    </span>
                  </p>
                  <Button
                    onClick={() => handleApply(hostel)}
                    disabled={hostel.availableBeds <= 0}
                    className="w-full"
                  >
                    {hostel.availableBeds > 0 ? "Apply" : "No Beds Available"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hostels available yet.</p>
        )}
      </section>

      <Separator />

      {/* Application History */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardContent className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-semibold">{app.hostelName}</p>
                    <p className="text-xs text-gray-500">{app.date}</p>
                  </div>
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No applications yet.</p>
        )}
      </section>
    </main>
  );
}
