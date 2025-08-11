import { HostelRoom, StudentProfile } from "@/types";
import { Admin } from "@/types";

const STUDENT_SINGLE_KEY = "studentProfile";      // logged-in student
const STUDENT_LIST_KEY = "studentProfiles";       // all students
const ADMIN_KEY = "adminProfile";                 // logged-in admin
const ROOMS_KEY = "hostelRooms";                  // all rooms

// ✅ Logged-in Student Profile (used in login/profile)
export function saveStudentProfile(profile: StudentProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STUDENT_SINGLE_KEY, JSON.stringify(profile));
  }
}

export function loadStudentProfile(): StudentProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STUDENT_SINGLE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// ✅ All Students (used for room logic, admin page)
export function loadStudents(): StudentProfile[] {
  const data = localStorage.getItem(STUDENT_LIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveStudents(students: StudentProfile[]) {
  localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(students));
}

// ✅ Admin
export function saveAdminProfile(profile: Admin) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(profile));
  }
}

export function loadAdminProfile(): Admin | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// ✅ Rooms
export function loadRooms(): HostelRoom[] {
  const data = localStorage.getItem(ROOMS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRooms(rooms: HostelRoom[]) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}
