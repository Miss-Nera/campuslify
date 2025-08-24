export type Payment = {
  id: string;
  type: string; // e.g. "Tuition", "Hostel", etc.
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Declined";
}

export type Hostel = {
  id: string;
  name: string;
  capacity: number;
  gender: "male" | "female";
  availableBeds: number;
};

export type Application = {
  studentId: string;
  studentName: string;
  hostelId: string;
  hostelName: string;
  status: "Pending Approval" | "Approved" | "Declined";
  date: string;
};

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
}

export interface Admin {
  id: string;
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
export interface HostelRoom {
  students: string;
  id: string;
  name: string;         // e.g., "Room A1"
  capacity: number;     // e.g., 4
  occupants: string[];  // student IDs (to fetch from studentProfiles)
  roomNumber: string;
  status: "available" | "occupied" | "maintenance"; // ✅ Added
}


