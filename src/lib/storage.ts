import { HostelRoom, StudentProfile } from "@/types";

const ROOMS_KEY = "hostelRooms";
const STUDENTS_KEY = "studentProfiles";

export function getHostelRooms(): HostelRoom[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ROOMS_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

export function saveHostelRooms(rooms: HostelRoom[]) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

export function getStudents(): StudentProfile[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

export function saveStudents(students: StudentProfile[]) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}
