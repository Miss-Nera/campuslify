"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { StudentProfile } from "@/types";
import { User, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  loadStudentProfile,
  saveStudentProfile,
} from "@/utils/localstorage";


const defaultProfile: StudentProfile = {
  id: "abc123",
  fullName: "John Doe",
  matricNumber: "M123456",
  department: "Computer Science",
  level: "300",
  email: "johndoe@example.com",
  phone: "08012345678",
  address: "Campus Road",
  gender: "male",
  dob: "2000-01-01",
  hostel: "Block A",
  college: "Engineering",
  password: "password123",
  image: "/default.jpg",

  // ✅ This is the important line:
  payments: [],
};


export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const stored = loadStudentProfile(); // ✅ correct key and function
    const storedImg = localStorage.getItem("profileImage");

    if (stored) {
      setProfile(stored);
      setImage(stored.image || storedImg || "");
    } else if (storedImg) {
      setImage(storedImg);
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgData = reader.result as string;
        setImage(imgData);
        setProfile((prev) => ({ ...prev, image: imgData }));
        localStorage.setItem("profileImage", imgData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!profile.fullName || !profile.matricNumber || !profile.email) {
      toast.error("Please fill all required fields.");
      return;
    }

    saveStudentProfile(profile); // ✅ correct save function
    toast.success("Profile saved successfully.");
    setIsEditing(false);
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4 sm:px-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
          Student Profile
        </h1>
        <ThemeToggle />
      </div>

      <Card className="shadow-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 transition duration-300">
        <CardHeader className="flex flex-col items-center gap-4 py-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-indigo-400 dark:ring-indigo-600">
            <Image
              src={image || "/default-avatar.png"}
              alt="Profile"
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
            {/* Personal Info */}
            <AccordionItem value="personal">
              <AccordionTrigger className="text-indigo-600 dark:text-indigo-400 font-medium">
                Personal Information
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { label: "Full Name", name: "fullName", icon: <User />, required: true },
                  { label: "Matric Number", name: "matricNumber", icon: "#️⃣", required: true },
                  { label: "Email", name: "email", icon: <Mail />, required: true },
                  { label: "Phone", name: "phone", icon: <Phone /> },
                ].map((field) => (
                  <div key={field.name}>
                    <Label className="flex gap-1 items-center text-sm text-indigo-700 dark:text-indigo-300">
                      {field.icon} {field.label}
                    </Label>
                    <Input
                      name={field.name}
                      value={String(profile[field.name as keyof StudentProfile] ?? "")}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required={field.required}
                      className="focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Academic & Other Info */}
            <AccordionItem value="academic">
              <AccordionTrigger className="text-indigo-600 dark:text-indigo-400 font-medium">
                Academic & Other Info
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-sm text-indigo-700 dark:text-indigo-300">Department</Label>
                  <Input
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <Label className="text-sm text-indigo-700 dark:text-indigo-300">Level</Label>
                  <Input
                    name="level"
                    value={profile.level}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <Label className="text-sm text-indigo-700 dark:text-indigo-300">Gender</Label>
                  <select
                    name="gender"
                    value={profile.gender}
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
                    value={profile.dob || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="flex gap-1 items-center text-sm text-indigo-700 dark:text-indigo-300">
                    <MapPin /> Address
                  </Label>
                  <Input
                    name="address"
                    value={profile?.address || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="focus:ring-indigo-500"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {isEditing && (
            <div className="text-right mt-6">
              <Button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
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
