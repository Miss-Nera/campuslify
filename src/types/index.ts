export interface StudentProfile {
  hostel: string;
  college: string;
  id: string;
  fullName: string;
  matricNumber: string;
  department: string;
  level: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  password: string;
  image?: string;
  gender: "male" |"female";
  createdAt?: Date; 
}
export interface Admin {
  id: string;              // ✅ Used for login and internal ID
  fullName: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  gender: "male" | "female";
  dob: string;             // "YYYY-MM-DD"
  department: string;
  post: string;
  image?: string;
}



