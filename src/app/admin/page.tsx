"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Users, CreditCard, BarChart3, UserCircle } from "lucide-react"; // icons
import { motion } from "framer-motion"; // animations

type AdminProfile = {
  adminId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  image?: string;
};

type StudentProfile = {
  fullName: string;
  matricNumber: string;
  department: string;
  level: string;
  email: string;
  payments?: { type: string; amount: number; date: string; status: string }[];
};

const ACTIVE_ADMIN_KEY = "adminProfile";
const STUDENTS_KEY = "studentProfiles";

export default function AdminDashboard() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    const adminData = localStorage.getItem(ACTIVE_ADMIN_KEY);
    if (adminData) setProfile(JSON.parse(adminData));

    const studentData = localStorage.getItem(STUDENTS_KEY);
    if (studentData) setStudents(JSON.parse(studentData));
  }, []);

  if (!profile) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
        Loading dashboard...
      </p>
    );
  }

  const totalStudents = students.length;
  const pendingPayments = students.filter((s) =>
    s.payments?.some((p) => p.status.toLowerCase() !== "paid")
  ).length;

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
            <Avatar className="h-16 w-16 ring-2 ring-indigo-500">
              <AvatarImage src={profile.image || "/default-avatar.png"} />
              <AvatarFallback>
                {profile.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{profile.fullName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.department} — Admin
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Admin ID:</strong> {profile.adminId}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg border-t-4 border-indigo-500">
          <CardHeader className="flex items-center gap-2 font-semibold">
            <Users className="w-5 h-5 text-indigo-500" /> Student Management
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View, add, or edit student profiles.
            </p>
            <Link href="/admin/ManageStudents">
              <Button className="mt-3 w-full">Manage Students</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg border-t-4 border-emerald-500">
          <CardHeader className="flex items-center gap-2 font-semibold">
            <CreditCard className="w-5 h-5 text-emerald-500" /> Payments
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track student payments and pending dues.
            </p>
            <Link href="/admin/payments">
              <Button className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600">
                Manage Payments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg border-t-4 border-amber-500">
          <CardHeader className="flex items-center gap-2 font-semibold">
            <BarChart3 className="w-5 h-5 text-amber-500" /> Reports
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View summary statistics for students and payments.
            </p>
            <Link href="/admin/reports">
              <Button className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white">
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="shadow-md hover:shadow-lg border-t-4 border-indigo-500">
            <CardHeader>Total Students</CardHeader>
            <CardContent>
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-indigo-600"
              >
                {totalStudents}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="shadow-md hover:shadow-lg border-t-4 border-amber-500">
            <CardHeader>Pending Payments</CardHeader>
            <CardContent>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-amber-600"
              >
                {pendingPayments}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="shadow-md hover:shadow-lg border-t-4 border-emerald-500">
            <CardHeader>Latest Student</CardHeader>
            <CardContent>
              {students.length ? (
                <>
                  <p className="font-semibold text-emerald-600">
                    {students[students.length - 1].fullName}
                  </p>
                  <p>{students[students.length - 1].department}</p>
                </>
              ) : (
                <p className="text-gray-500">No students yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/ManageStudents">
          <Button className="w-full">Manage Students</Button>
        </Link>
        <Link href="/admin/payments">
          <Button
            variant="outline"
            className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Manage Payments
          </Button>
        </Link>
        <Link href="/admin/profile">
          <Button
            variant="outline"
            className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            Edit Profile
          </Button>
        </Link>
      </div>
    </main>
  );
}
