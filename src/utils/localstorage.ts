// utils/localstorage.ts
import { StudentProfile } from "@/types";
import { Admin } from "@/types";

type AdminProfile = Admin & { image?: string };

const STORAGE_KEY = "student-profile";

export function saveProfile(profile: StudentProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

export function loadProfile(): StudentProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}
export const saveAdminProfile = (admin: AdminProfile) => {
  localStorage.setItem("adminProfile", JSON.stringify(admin));
};

export const loadAdminProfile = (): AdminProfile | null => {
  const stored = localStorage.getItem("adminProfile");
  return stored ? JSON.parse(stored) as AdminProfile : null;
};
