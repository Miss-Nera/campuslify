"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import type { Admin } from "@/types";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    adminID: "",
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

    const hasEmptyField = Object.values(form).some((val) => val.trim() === "");
    if (hasEmptyField) {
      toast.error("Please fill in all fields.");
      return;
    }


const existing: Admin[] = JSON.parse(localStorage.getItem("adminAccounts") || "[]");


    const idExists = existing.some((admin) => admin.adminID === form.adminID);
    if (idExists) {
      toast.error("Admin ID already exists.");
      return;
    }

    const updated = [...existing, form];
    localStorage.setItem("adminAccounts", JSON.stringify(updated));

    toast.success("Admin account created!");
    setTimeout(() => {
      router.push("/admin");
    }, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="w-full max-w-md bg-white border border-indigo-200 shadow-xl rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">Admin Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "fullName", placeholder: "e.g. Mr. John Doe" },
            { label: "Admin ID", name: "adminID", placeholder: "e.g. admin001" },
            { label: "Email", name: "email", placeholder: "e.g. admin@example.com", type: "email" },
          ].map(({ label, name, placeholder, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm text-gray-700 mb-1">{label}</label>
              <Input
                type={type}
                name={name}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a secure password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Register
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Already registered?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </main>
  );
}
