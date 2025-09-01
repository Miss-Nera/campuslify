// app/admin/profile/edit/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasswordInput from "@/components/PasswordInput";
import { Admin } from "@/types";
// import { loadAdminProfile, saveAdminProfile, loadAdmins, saveAllAdmins } from "@/utils/auth";
import Link from "next/link";
import { loadAdminProfile, saveAdminProfile } from "@/utils/localstorage";
import { loadAdmins, saveAllAdmins } from "@/utils/auth";

export default function EditAdminProfilePage() {
  const [profile, setProfile] = useState<Admin | null>(null);

  // Hydrate split names from fullName once
  useEffect(() => {
    const data = loadAdminProfile();
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

  const handleChange = <K extends keyof Admin>(key: K, value: Admin[K]) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = () => {
    if (!profile) return;

    const toSave: Admin = {
      ...profile,
      fullName: composedFullName,
    };

    if (!toSave.firstName || !toSave.lastName) {
      toast.error("Please enter at least First Name and Surname");
      return;
    }
    if (!toSave.email) {
      toast.error("Email is required");
      return;
    }

    // Update current admin
    saveAdminProfile(toSave);

    // Update admin list
    const admins = loadAdmins();
    const updatedAdmins = admins.map((a) => (a.adminId === toSave.adminId ? toSave : a));
    saveAllAdmins(updatedAdmins);

    toast.success("Admin profile updated successfully");
  };

  if (!profile) return <p className="text-center text-muted-foreground mt-10">No admin profile found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg border border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-600">Edit Admin Profile</CardTitle>
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

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
            <Label htmlFor="adminId">Admin ID</Label>
            <Input
              id="adminId"
              name="adminId"
              value={profile.adminId}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
              <Label>Date of Birth</Label>
                <Input
                    type="date"
                    value={profile.dob || ""}   // ✅ ensures never undefined
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
          {/* </div> */}

          {/* Work Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Gender</Label>
              <Select
                value={profile.gender || ""}
                onValueChange={(v) => handleChange("gender", v as Admin["gender"])}
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
              <Label>Department</Label>
              <Input
                value={profile.department || ""}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>

            <div>
              <Label>Post</Label>
              <Input
                value={profile.post || ""}
                onChange={(e) => handleChange("post", e.target.value)}
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
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Display name will appear as <span className="font-medium">{composedFullName || "—"}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
