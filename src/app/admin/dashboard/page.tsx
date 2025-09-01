"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type AdminProfile = {
  adminId: string;       // Make sure this matches the registration
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
    if (adminData) {
      const parsed: AdminProfile = JSON.parse(adminData);
      setProfile(parsed);
    }

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
  const pendingPayments = students.filter(s =>
    s.payments?.some(p => p.status.toLowerCase() !== "paid")
  ).length;

  return (
    <main className="max-w-6xl mx-auto p-6 mt-8 space-y-8">
      {/* Greeting */}
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        Welcome back, {profile.fullName.split(" ")[0]} 👋
      </h1>

      {/* Profile Overview */}
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
        <Card className="shadow-md">
          <CardHeader className="font-semibold">Student Management</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View, add, or edit student profiles.
            </p>
            <Link href="/admin/ManageStudents">
              <Button className="mt-3 w-full">Manage Students</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="font-semibold">Payments</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track student payments and pending dues.
            </p>
            <Link href="/admin/payments">
              <Button className="mt-3 w-full">Manage Payments</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="font-semibold">Reports</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View summary statistics for students and payments.
            </p>
            <Link href="/admin/reports">
              <Button className="mt-3 w-full">View Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>Total Students</CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>Pending Payments</CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{pendingPayments}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>Latest Student</CardHeader>
          <CardContent>
            {students.length ? (
              <>
                <p><strong>{students[students.length - 1].fullName}</strong></p>
                <p>{students[students.length - 1].department}</p>
              </>
            ) : (
              <p>No students yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/ManageStudents">
          <Button className="w-full">Manage Students</Button>
        </Link>
        <Link href="/admin/payments">
          <Button variant="outline" className="w-full">Manage Payments</Button>
        </Link>
        <Link href="/admin/profile">
          <Button variant="outline" className="w-full">Edit Profile</Button>
        </Link>
      </div>
    </main>
  );
}
