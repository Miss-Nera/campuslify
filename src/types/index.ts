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
  gender: string;
  createdAt?: Date; 
}
export type Admin = {
  fullName: string;
  adminID: string;
  email: string;
  password: string;
  image?:string
};

