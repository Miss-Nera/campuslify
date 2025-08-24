"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { StudentProfile } from "@/types";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("studentProfile");
    if (data) {
      setProfile(JSON.parse(data));
    }
  }, []);

  if (!profile) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
        Loading dashboard...
      </p>
    );
  }

  const latestPayment = profile.payments?.[profile.payments.length - 1];

  return (
    <main className="max-w-6xl mx-auto p-6 mt-8 space-y-8">
      {/* Greeting */}
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        Welcome back, {profile.fullName.split(" ")[0]} 👋
      </h1>

      {/* Profile Overview with Avatar */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold">Profile Overview</CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.image || "/default-avatar.png"} />
              <AvatarFallback>
                {profile.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{profile.fullName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.department} — {profile.level}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Matric No:</strong> {profile.matricNumber}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Hostel:</strong> {profile.hostel}</p>
            <p><strong>College:</strong> {profile.college}</p>
            <p><strong>DOB:</strong> {profile.dob}</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="font-semibold">Accommodation</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Apply or check hostel allocation.
            </p>
            <Link href="/student/accommodation">
              <Button className="mt-3 w-full">Manage Accommodation</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="font-semibold">Academic Calendar</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Stay updated with key semester events.
            </p>
            <Link href="/student/calendar">
              <Button className="mt-3 w-full">View Calendar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="font-semibold">Results & CGPA</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track your performance and CGPA progress.
            </p>
            <Link href="/student/results">
              <Button className="mt-3 w-full">Check Results</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Latest Payment */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold">Latest Payment</CardHeader>
        <CardContent className="text-sm text-gray-700 dark:text-gray-300">
          {latestPayment ? (
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Type:</strong> {latestPayment.type}</p>
                <p><strong>Amount:</strong> ₦{latestPayment.amount}</p>
                <p><strong>Date:</strong> {latestPayment.date}</p>
              </div>
              <Badge
                variant={
                  latestPayment.status.toLowerCase() === "paid"
                    ? "default"
                    : "destructive"
                }
              >
                {latestPayment.status}
              </Badge>
            </div>
          ) : (
            <p>No payments made yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/student/payment">
          <Button className="w-full">Make a Payment</Button>
        </Link>
        <Link href="/student/paymentHistory">
          <Button variant="outline" className="w-full">Payment History</Button>
        </Link>
        <Link href="/student/profile">
          <Button variant="outline" className="w-full">Edit Profile</Button>
        </Link>
      </div>
    </main>
  );
}
