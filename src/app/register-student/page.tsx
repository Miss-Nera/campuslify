"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function StudentRegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    matricNumber: "",
    department: "",
    level: "",
    email: "",
    phone: "",
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

    // ✅ Save under the correct key
    localStorage.setItem("studentProfile", JSON.stringify(form));
    toast.success("Account created successfully!");

    setTimeout(() => {
      router.push("/student");
    }, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl border border-indigo-200 space-y-6">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">
          Student Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "fullName", placeholder: "e.g. Jane Doe" },
            { label: "Matric Number", name: "matricNumber", placeholder: "e.g. 22/0000" },
            { label: "Department", name: "department", placeholder: "e.g. Computer Science" },
            { label: "Level", name: "level", placeholder: "e.g. 300" },
            { label: "Email", name: "email", placeholder: "e.g. janedoe@email.com", type: "email" },
            { label: "Phone", name: "phone", placeholder: "e.g. 08012345678" },
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
                placeholder="Create a strong password"
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
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </main>
  );
}
