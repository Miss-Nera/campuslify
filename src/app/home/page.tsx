"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface StudentProfile {
  fullName: string;
  matricNumber: string;
  department: string;
  level: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  password: string;
  image?: string;
}

const defaultProfile: StudentProfile = {
  fullName: "",
  matricNumber: "",
  department: "",
  level: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  dob: "",
  password: "",
  image: "",
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("studentProfile");
    if (stored) {
      try {
        const parsed: StudentProfile = JSON.parse(stored);
        setProfile({
          ...defaultProfile,
          ...parsed, // ensures all fields are defined
        });
        if (parsed.image) setImagePreview(parsed.image);
      } catch (error) {
  console.error("Invalid profile data in localStorage:", error);
}

    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfile((prev) => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.fullName || !profile.matricNumber || !profile.password) {
      toast.error("Please fill in required fields.");
      return;
    }

    localStorage.setItem("studentProfile", JSON.stringify(profile));
    toast.success("Profile saved successfully 🎉");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white dark:from-zinc-900 dark:to-black p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 space-y-6 border border-indigo-100 dark:border-zinc-700">
        <h1 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-4">
          Student Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload */}
          <div className="flex flex-col items-center gap-3">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover h-24 w-24"
              />
            ) : (
              <div className="h-24 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-600 dark:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="fullName" value={profile.fullName || ""} onChange={handleChange} placeholder="Full Name" required />
            <Input name="matricNumber" value={profile.matricNumber || ""} onChange={handleChange} placeholder="Matric Number" required />
            <Input name="department" value={profile.department || ""} onChange={handleChange} placeholder="Department" />
            <Input name="level" value={profile.level || ""} onChange={handleChange} placeholder="Level" />
            <Input name="email" value={profile.email || ""} onChange={handleChange} placeholder="Email" />
            <Input name="phone" value={profile.phone || ""} onChange={handleChange} placeholder="Phone" />
            <Input name="address" value={profile.address || ""} onChange={handleChange} placeholder="Address" />
            <Input name="dob" type="date" value={profile.dob || ""} onChange={handleChange} />

            <select
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

            {/* Password */}
            <div className="relative col-span-full">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={profile.password || ""}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Save Profile
          </Button>
        </form>
      </div>
    </main>
  );
}
