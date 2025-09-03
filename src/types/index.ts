export type Payment = {
  id: string;
  type: string; // e.g. "Tuition", "Hostel", etc.
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Declined";
}

export interface HostelRoom {
  students: string;
  id: string;
  name: string;
  capacity: number;
  occupants: string[];
  roomNumber: string;
  status: "available" | "occupied" | "maintenance";
}

export interface CourseResult {
  name: string;
  code: string;
  grade: string;
}

export interface SemesterResult {
  semester: string;   // e.g. "First Semester 2024"
  gpa: number;        // GPA for that semester
  courses: CourseResult[];
}

export interface StudentProfile {
  hostel: string;
  college: string;
  id: string;
  fullName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  matricNumber: string;
  department: string;
  level: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  password: string;
  image?: string;
  gender: "male" | "female";
  createdAt?: Date;
  results?: SemesterResult[];
  cgpa?: number;
  payments: Payment[];
   emergencyContact: string;
  roomId?: string;
  imageUrl?: string;
  accommodation?: Accommodation; // ✅ reference accommodation
}

export interface Admin {
  adminId: string;
  fullName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  gender: "male" | "female";
  dob: string;
  department: string;
  post: string;
  image?: string;
}

export interface Accommodation {
  hostelId: string;
  hostelName: string;
  roomId: string;
  roomName: string;
  paymentId: string; // link to the payment record
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category?: string;
  date: string; // ISO string
  author: string; // admin who posted
};
// types.ts
export interface Course {
  id: string;        // unique ID
  code: string;      // e.g. CSC101
  title: string;     // e.g. Introduction to Computer Science
  units: number;     // credit units
  lecturer: string;
}

export interface StudentRegistration {
  matric: string;      // student matric number
  registered: Course[]; // list of registered courses
}

