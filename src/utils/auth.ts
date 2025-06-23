import { StudentProfile } from "@/types";

const STUDENT_KEY = "studentProfile";
const ADMIN_KEY = "adminProfiles";

// Load single student
export function loadStudent(): StudentProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STUDENT_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Load all admins
export function loadAdmins(): StudentProfile[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

// Seed default admins
export function seedAdminAccounts() {
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem(ADMIN_KEY);
    if (!existing) {
      const defaultAdmins = [
        { id: "admin001", name: "Admin One", password: "adminpass" },
        { id: "admin002", name: "Jane Admin", password: "123456" },
      ];
      localStorage.setItem(ADMIN_KEY, JSON.stringify(defaultAdmins));
    }
  }
}
