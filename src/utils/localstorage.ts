import { StudentProfile } from "@/types";
import { Admin } from "@/types";

type AdminProfile = Admin & { image?: string };

// Student key – declared only once
const STUDENT_KEY = "studentProfile";
const ADMIN_KEY = "adminProfile";

// ✅ Student
export function saveStudentProfile(profile: StudentProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(profile));
  }
}

export function loadStudentProfile(): StudentProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STUDENT_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// ✅ Admin
export function saveAdminProfile(profile: AdminProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(profile));
  }
}

export function loadAdminProfile(): AdminProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}
