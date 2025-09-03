"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Home,
  CalendarDays,
  GraduationCap,
  CreditCard,
  Edit,
  History,
  UserCircle,
} from "lucide-react";
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
    <main className="max-w-6xl mx-auto p-6 mt-8 space-y-8 bg-gray-50 dark:bg-slate-900 rounded-xl">
          {/* Greeting Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md"
          >
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {profile.fullName.split(" ")[0]} 👋
            </h1>
            <p className="text-sm opacity-90 mt-1">Have a productive day!</p>
          </motion.div>

      {/* Profile Overview */}
      <Card className="shadow-md hover:shadow-lg transition backdrop-blur bg-white/70 dark:bg-slate-800/60">
              <CardHeader className="border-b border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-indigo-600 font-semibold">
                <UserCircle className="w-5 h-5" /> Profile Overview
              </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-indigo-400">
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
          <Card className="shadow-md hover:shadow-lg border-t-4 border-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-600">
              <Home className="w-5 h-5" /> Accommodation
            </CardTitle>
          </CardHeader>
          <CardHeader className="flex items-center gap-2 font-semibold">
            </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Apply or check hostel allocation.
            </p>
            <Link href="/student/accommodation">
                <Button className="mt-3 w-full bg-indigo-500 hover:bg-indigo-600">
                Manage Accommodation
                </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg border-t-4 border-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-600">
              <CalendarDays className="w-5 h-5" /> Academic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Stay updated with key semester events.
            </p>
            <Link href="/student/calendar">
              <Button className="mt-3 w-full bg-teal-500 hover:bg-teal-600">
                View Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow border-t-4 border-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <GraduationCap className="w-5 h-5" /> Results & CGPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track your performance and CGPA progress.
            </p>
            <Link href="/student/results">
             <Button className="mt-3 w-full bg-purple-500 hover:bg-purple-600">
                Check Results
                </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Latest Payment */}
      <Card className="shadow-md border-t-4 border-emerald-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <CreditCard className="w-5 h-5" /> Latest Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 dark:text-gray-300">
          {latestPayment ? (
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Type:</strong> {latestPayment.type}</p>
                <p><strong>Amount:</strong> ₦{latestPayment.amount}</p>
                <p><strong>Date:</strong> {latestPayment.date}</p>
              </div>
              <Badge
                className="px-3 py-1"
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
    <Button className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl">
      <CreditCard className="w-4 h-4" /> 
      Make a Payment
    </Button>
  </Link>

  <Link href="/student/paymentHistory">
    <Button className="w-full flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md rounded-xl">
      <History className="w-4 h-4" /> 
      Payment History
    </Button>
  </Link>

  <Link href="/student/profile">
    <Button className="w-full flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white shadow-md rounded-xl">
      <Edit className="w-4 h-4" /> 
      Edit Profile
    </Button>
  </Link>
</div>

    </main>
  );
}
