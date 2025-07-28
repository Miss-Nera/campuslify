"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HostelApplication = {
  id: string;
  studentId: string;
  hostel: string;
  status: "pending" | "approved" | "declined";
};

export default function AdminDashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [pendingHostels, setPendingHostels] = useState(0);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem("studentDataList") || "[]");
    setTotalStudents(students.length);

    const hostelApps: HostelApplication[] = JSON.parse(
      localStorage.getItem("hostelApplications") || "[]"
    );
    const pending = hostelApps.filter(app => app.status === "pending");
    setPendingHostels(pending.length);
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        Welcome Admin 👨‍💼
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardHeader className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            Total Registered Students
          </CardHeader>
          <CardContent className="text-2xl font-bold text-indigo-700">
            {totalStudents}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            Pending Hostel Applications
          </CardHeader>
          <CardContent className="text-2xl font-bold text-indigo-700">
            {pendingHostels}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/approve-accommodation">
          <Button variant="outline" className="w-full">Review Hostel Requests</Button>
        </Link>
        <Link href="/admin/manage-results">
          <Button variant="outline" className="w-full">Manage Results</Button>
        </Link>
        <Link href="/admin/payments">
          <Button className="w-full">View Payments</Button>
        </Link>
      </div>
    </main>
  );
}
