// app/student/profile/edit/page.tsx (or your route)
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentProfile } from "@/types";
import PasswordInput from "@/components/PasswordInput";
import { loadStudent, saveStudent } from "@/utils/auth";
import Link from "next/link";

export default function EditStudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Hydrate split names from fullName once (safe + non-breaking)
   useEffect(() => {
    const data = loadStudent();
    if (!data) return;

    if (!data.firstName && data.fullName) {
      const parts = data.fullName.trim().split(/\s+/);
      const [firstName = "", middleOrLast = "", ...rest] = parts;
      const lastName = rest.length ? rest.join(" ") : middleOrLast;
      const middleName = rest.length ? middleOrLast : "";
      setProfile({ ...data, firstName, middleName, lastName });
    } else {
      setProfile(data);
    }
  }, []);

  // Compose full name from split fields for display/save
  const composedFullName = useMemo(() => {
    if (!profile) return "";
    return [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || profile.fullName || "";
  }, [profile]);

  const handleChange = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = () => {
    if (!profile) return;

    // Persist both: split fields + computed fullName (for existing pages)
    const toSave: StudentProfile = {
      ...profile,
      fullName: composedFullName,
    };

    // Basic guards (you can extend validation as needed)
    if (!toSave.firstName || !toSave.lastName) {
      toast.error("Please enter at least First Name and Surname");
      return;
    }
    if (!toSave.email) {
      toast.error("Email is required");
      return;
    }

    saveStudent(toSave);
    toast.success("Profile updated successfully");
  };

  if (!profile) return <p className="text-center text-muted-foreground mt-10">No student profile found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg border border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-600">Edit Student Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Image
              src={profile.image || "/default-avatar.png"}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-indigo-200"
            />
            <div className="flex-1">
              <Label htmlFor="image">Change Picture</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => handleChange("image", reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </div>

          {/* Name split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={profile.firstName || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <Label>Middle Name (optional)</Label>
              <Input
                value={profile.middleName || ""}
                onChange={(e) => handleChange("middleName", e.target.value)}
              />
            </div>
            <div>
              <Label>Surname</Label>
              <Input
                value={profile.lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* ID/Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Matric Number</Label>
              <Input value={profile.matricNumber} disabled className="bg-muted" />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={profile.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Academic / School */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Gender</Label>
              <Select
                value={profile.gender || ""}
                onValueChange={(v) => handleChange("gender", v as StudentProfile["gender"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Level</Label>
              <Select
                value={profile.level || ""}
                onValueChange={(v) => handleChange("level", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                  <SelectItem value="500">500 Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>College</Label>
              <Input
                value={profile.college || ""}
                onChange={(e) => handleChange("college", e.target.value)}
              />
            </div>
             <div className="md:col-span-2">
              <Label>Department</Label>
              <Input
                value={profile.department || ""}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Hostel</Label>
              <Input
                value={profile.hostel || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Hostel is set automatically when the student is allocated a room.
              </p>
            </div>
          </div>

          {/* Other */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Emergency Contact</Label>
              <Input
                value={profile.emergencyContact || ""}
                onChange={(e) => handleChange("emergencyContact", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                value={profile.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>

          {/* Password with eye toggle */}
          <div>
            <Label>Password</Label>
            <PasswordInput
              value={profile.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          {/* Save */}
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
            onClick={handleSave}
          >
            Save Profile
          </Button>
          <div className="mt-6">
        <Link href="/student/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
          {/* (Optional) Show computed full name so user sees final result */}
          <p className="text-xs text-muted-foreground text-center">
            Display name will appear as <span className="font-medium">{composedFullName || "—"}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
