"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

type AdminProfile = {
  adminId: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  department: string;
  address: string;
};

const ADMINS_KEY = "adminProfiles";
const ACTIVE_ADMIN_KEY = "adminProfile";

export default function AdminRegisterPage() {
  const [form, setForm] = useState<AdminProfile>({
    adminId: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    address: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const existing: AdminProfile[] = JSON.parse(
      localStorage.getItem(ADMINS_KEY) || "[]"
    );

    if (existing.some((a) => a.adminId === form.adminId)) {
      toast.error("Admin ID already registered!");
      return;
    }

    const updated = [...existing, form];
    localStorage.setItem(ADMINS_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_ADMIN_KEY, JSON.stringify(form));

    toast.success("Admin registration successful!");
    router.push("/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Admin Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Admin ID</Label>
            <Input
              name="adminId"
              value={form.adminId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Full Name</Label>
            <Input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Department / Role</Label>
            <Input
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          {/* Password */}
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div>
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
