import { Admin, StudentProfile } from "@/types";

const STUDENT_KEY = "studentProfile";
const ADMIN_KEY = "adminProfiles";
const CURRENT_ADMIN_KEY = "currentAdminProfile";

// Load a single student profile
export function loadStudent(): StudentProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STUDENT_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Load all admin accounts
export function loadAdmins(): Admin[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
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
  }
}

// Save or update adminProfiles (e.g., during registration)
export function saveAllAdmins(admins: Admin[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
  }
}

// Seed default admin (only if adminProfiles is empty)
export function seedAdminAccounts() {
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem(ADMIN_KEY);
    if (!existing) {
      const defaultAdmins: Admin[] = [
        {
          id: "admin001",
          fullName: "Solomon Kachala",
          email: "ishaku85@gmail.com",
          password: "Ishaku123.",
          phone: "",
          address: "",
          gender: "male",
          dob: "",
          department: "",
          post: "",
          image: ""
        }
      ];
      saveAllAdmins(defaultAdmins);
    }
  }
}
