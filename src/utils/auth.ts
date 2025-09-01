import { Admin, StudentProfile } from "@/types";

const STUDENT_KEY = "studentProfile";
const ADMIN_KEY = "adminProfiles";          // all admins
const CURRENT_ADMIN_KEY = "currentAdminProfile"; // logged-in admin

/* ================= STUDENT ================= */

// Load a single student profile
export function loadStudent(): StudentProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STUDENT_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Save a single student profile
export function saveStudent(profile: StudentProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(profile));
  }
}

/* ================= ADMINS ================= */

// Load all registered admin accounts
export function loadAdmins(): Admin[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

// Save all admins (for registration or updates)
export function saveAllAdmins(admins: Admin[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
  }
}

// Load the currently logged-in admin
export function loadAdminProfile(): Admin | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CURRENT_ADMIN_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Save the currently logged-in admin
export function saveAdminProfile(profile: Admin) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(profile));

    // 🔥 also update inside adminProfiles
    const admins = loadAdmins();
    const index = admins.findIndex((a) => a.id === profile.id);
    if (index !== -1) {
      admins[index] = profile;
      saveAllAdmins(admins);
    }
  }
}
