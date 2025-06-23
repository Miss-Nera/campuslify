"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Admin } from "@/types";
import { Mail, User, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { saveAdminProfile, loadAdminProfile } from "@/utils/localstorage";

const defaultAdmin: Admin & { image?: string } = {
  fullName: "",
  adminID: "",
  email: "",
  password: "",
  image: "",
};

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<typeof defaultAdmin>(defaultAdmin);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const stored = loadAdminProfile();
    if (stored) {
      setAdmin(stored);
      setImage(stored.image || "");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgData = reader.result as string;
        setImage(imgData);
        setAdmin((prev) => ({ ...prev, image: imgData }));
        localStorage.setItem("adminImage", imgData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!admin.fullName || !admin.adminID || !admin.email) {
      toast.error("Please fill all required fields.");
      return;
    }
    saveAdminProfile(admin);
    toast.success("Admin profile saved.");
    setIsEditing(false);
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
          Admin Profile
        </h1>
        <ThemeToggle />
      </div>

      <Card className="shadow-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 transition">
        <CardHeader className="flex flex-col items-center gap-4 py-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-indigo-400 dark:ring-indigo-600">
            <Image
              src={image || "/default-avatar.png"}
              alt="Admin"
              fill
              className="object-cover"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6">
          {[
            { label: "Full Name", name: "fullName", icon: <User />, required: true },
            { label: "Admin ID", name: "adminID", icon: <Shield />, required: true },
            { label: "Email", name: "email", icon: <Mail />, required: true },
          ].map((field) => (
            <div key={field.name}>
              <Label className="flex items-center gap-1 text-sm text-indigo-700 dark:text-indigo-300">
                {field.icon} {field.label}
              </Label>
              <Input
                name={field.name}
                value={admin[field.name as keyof typeof defaultAdmin] ?? ""}
                onChange={handleChange}
                disabled={!isEditing}
                required={field.required}
                className="focus:ring-indigo-500"
              />
            </div>
          ))}

          <div>
            <Label className="text-sm text-indigo-700 dark:text-indigo-300">Password</Label>
            <Input
              name="password"
              type="password"
              value={admin.password}
              onChange={handleChange}
              disabled={!isEditing}
              className="focus:ring-indigo-500"
            />
          </div>

          {isEditing && (
            <div className="text-right pt-4">
              <Button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
