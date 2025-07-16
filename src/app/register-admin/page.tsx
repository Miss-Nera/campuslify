"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Admin } from "@/types";
import { loadAdmins, saveAdminProfile, saveAllAdmins } from "@/utils/auth";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    id: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(form).some((v) => v.trim() === "")) {
      toast.error("All fields are required.");
      return;
    }

    const admins = loadAdmins();
    const idTaken = admins.some((admin) => admin.id === form.id.trim());
    const emailTaken = admins.some((admin) => admin.email === form.email.trim());

    if (idTaken || emailTaken) {
      toast.error("Admin ID or email already exists.");
      return;
    }

    const newAdmin: Admin = {
      id: form.id.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: "",
      address: "",
      gender: "male",
      dob: "",
      department: "",
      post: "",
      image: "",
    };

    const updated = [...admins, newAdmin];
    saveAllAdmins(updated); // ✅ Save to adminAccounts
    saveAdminProfile(newAdmin); // ✅ Save current admin

    toast.success("Registration successful!");
    setTimeout(() => {
      router.push("/admin"); // ✅ Go directly to admin page
    }, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="w-full max-w-md bg-white border shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">Register Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
          <Input name="id" placeholder="Admin ID" value={form.id} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} type="email" />
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 text-white">
            Register
          </Button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
