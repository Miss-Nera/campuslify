"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Admin } from "@/types";
import {
  User, Shield, Mail, Lock, Phone, MapPin, Calendar,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { loadAdminProfile, saveAdminProfile } from "@/utils/localstorage";

const defaultAdmin: Admin & { image?: string } = {
  id: "",
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  gender: "male",
  dob: "",
  department: "",
  post: "",
  image: "",
};

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState(defaultAdmin);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = loadAdminProfile();
    const storedImg = localStorage.getItem("adminImage");

    if (stored) {
      setAdmin(stored);
      setImage(stored.image || storedImg || "");
    } else if (storedImg) {
      setImage(storedImg);
    }
  }, []);

  const validateField = (name: string, value: string) => {
    if (!value && ["fullName", "id", "email"].includes(name)) {
      return "This field is required.";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setAdmin((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveAdminProfile({ ...admin, [name]: value });
      toast.success("Changes auto-saved");
    }, 3000);
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
    const requiredFields = ["fullName", "id", "email"];
    const newErrors: { [key: string]: string } = {};
    requiredFields.forEach((field) => {
      if (!admin[field as keyof typeof admin]) {
        newErrors[field] = "This field is required.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors.");
      return;
    }

    saveAdminProfile(admin);
    toast.success("Profile saved successfully.");
    setIsEditing(false);
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4 sm:px-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
          Admin Profile
        </h1>
        <ThemeToggle />
      </div>

      <Card className="shadow-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 transition duration-300">
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

        <CardContent className="space-y-6 px-6 pb-8">
          <Accordion type="multiple" className="w-full">

            {/* Admin Info */}
            <AccordionItem value="admin-info">
              <AccordionTrigger className="text-indigo-600 dark:text-indigo-400 font-medium">
                Admin Information
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { label: "Full Name", name: "fullName", icon: <User /> },
                  { label: "Admin ID", name: "id", icon: <Shield /> },
                  { label: "Email", name: "email", icon: <Mail /> },
                  { label: "Phone", name: "phone", icon: <Phone /> },
                  { label: "Department", name: "department", icon: "🏢" },
                  { label: "Post", name: "post", icon: "📌" },
                ].map(({ label, name, icon }) => (
                  <div key={name}>
                    <Label className="flex gap-1 items-center text-sm text-indigo-700 dark:text-indigo-300">
                      {icon} {label}
                    </Label>
                    <Input
                      name={name}
                      value={admin[name as keyof Admin] || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    {errors[name] && isEditing && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Personal Info */}
            <AccordionItem value="personal-info">
              <AccordionTrigger className="text-indigo-600 dark:text-indigo-400 font-medium">
                Personal Information
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-sm text-indigo-700 dark:text-indigo-300">
                    Gender
                  </Label>
                  <select
                    name="gender"
                    value={admin.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <Label className="flex gap-1 items-center text-sm text-indigo-700 dark:text-indigo-300">
                    <Calendar /> Date of Birth
                  </Label>
                  <Input
                    type="date"
                    name="dob"
                    value={admin.dob || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label className="flex gap-1 items-center text-sm text-indigo-700 dark:text-indigo-300">
                    <MapPin /> Address
                  </Label>
                  <Input
                    name="address"
                    value={admin.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Security */}
            <AccordionItem value="security">
              <AccordionTrigger className="text-indigo-600 dark:text-indigo-400 font-medium">
                Security Settings
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Label className="flex gap-1 items-center text-sm text-indigo-700 dark:text-indigo-300">
                  <Lock /> Password
                </Label>
                <Input
                  name="password"
                  type="password"
                  value={admin.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {isEditing && (
            <div className="text-right mt-6">
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
