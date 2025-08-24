"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";


type StudentProfile = {
  id: string;
  password: string;
};

type AdminProfile = {
  id: string;
  password: string;
};


export default function LoginPage() {
   const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const students: StudentProfile[] = JSON.parse(
      localStorage.getItem("studentProfiles") || "[]"
    );
    const admins: AdminProfile[] = JSON.parse(
      localStorage.getItem("adminProfiles") || "[]"
    );

    const student = students.find((s) => s.password === password);
    const admin = admins.find((a) => a.password === password);

    if (student) {
      localStorage.setItem("studentProfile", JSON.stringify(student));
      toast.success("Login successful! Redirecting to Student Dashboard...");
      router.push("/student/dashboard");
    } else if (admin) {
      localStorage.setItem("adminProfile", JSON.stringify(admin));
      toast.success("Login successful! Redirecting to Admin Dashboard...");
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <Card className="w-full max-w-md p-6 shadow-xl bg-white dark:bg-gray-900 rounded-2xl">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">
            Welcome Back
          </h1>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Please enter your password to continue
          </p>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <Label>Password</Label>
            <div className="flex items-center gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="link" className="text-indigo-600 hover:underline">
            Forgot password?
          </Button>

          {/* Register Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-indigo-600 hover:underline">
                Don’t have an account? Register
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Account Type</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => (window.location.href = "/register-student")}
                >
                  Register as Student
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => (window.location.href = "/register-admin")}
                >
                  Register as Admin
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
