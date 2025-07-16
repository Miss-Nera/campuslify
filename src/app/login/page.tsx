"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { loadAdmins, loadStudent, saveAdminProfile, seedAdminAccounts } from "@/utils/auth";
import { saveStudentProfile } from "@/utils/localstorage";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [form, setForm] = useState({ id: "", name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    seedAdminAccounts(); // Seeds a default admin if needed
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = () => {
    setRole((prev) => (prev === "student" ? "admin" : "student"));
    setForm({ id: "", name: "", password: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, name, password } = form;

    if (!id || !name || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (role === "student") {
      const student = loadStudent();
      const match =
        student &&
        student.matricNumber?.trim().toLowerCase() === id.trim().toLowerCase() &&
        student.fullName?.trim().toLowerCase() === name.trim().toLowerCase() &&
        student.password === password;

      if (match) {
        saveStudentProfile(student); // ✅ consistent key
        toast.success("Welcome back, student!");
        router.push("/student");
      } else {
        toast.error("Invalid student credentials.");
      }
    } else {
      const admins = loadAdmins();
      const match = admins.find(
        (admin) =>
          admin.id?.trim().toLowerCase() === id.trim().toLowerCase() &&
          admin.fullName?.trim().toLowerCase() === name.trim().toLowerCase() &&
          admin.password === password
      );

      if (match) {
        saveAdminProfile(match); // ✅ saves under currentAdminProfile
        toast.success("Welcome, Admin!");
        router.push("/admin");
      } else {
        toast.error("Invalid admin credentials.");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-700 rounded-lg shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400">
          {role === "student" ? "Student" : "Admin"} Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              {role === "student" ? "Matric Number" : "Admin ID"}
            </label>
            <Input
              name="id"
              placeholder={role === "student" ? "e.g. 22/0000" : "e.g. admin001"}
              value={form.id}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Full Name</label>
            <Input
              name="name"
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Login
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {role === "student" ? (
              <>
                Are you an admin?{" "}
                <button type="button" onClick={handleRoleToggle} className="text-indigo-600 hover:underline">
                  Login as Admin
                </button>
              </>
            ) : (
              <>
                Are you a student?{" "}
                <button type="button" onClick={handleRoleToggle} className="text-indigo-600 hover:underline">
                  Login as Student
                </button>
              </>
            )}
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account?{" "}
            <a
              href={role === "student" ? "/register-student" : "/register-admin"}
              className="text-indigo-600 hover:underline"
            >
              Create {role === "student" ? "Student" : "Admin"} Account
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
