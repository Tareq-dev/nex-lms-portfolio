export type StudentId = string | number;

export type StudentStatus = "Active" | "Inactive";

export interface Student {
  id: StudentId;
  name: string;
  email: string;
  course: string;
  phone: string;
  date: string;
  batch?: string;
  status: StudentStatus;
}

export interface StudentFormData {
  name: string;
  email: string;
  course: string;
  phone: string;
  date: string;
  batch: string;
}