export type InstructorId = string | number;

export type InstructorStatus =
  | "Active"
  | "Inactive";

export interface Instructor {
  id: InstructorId;
  name: string;
  email: string;
  designation: string;
  education: string;
  job: string;
  phone: string;
  courses: string;
  status: InstructorStatus;
}

export type InstructorFormData = Omit<
  Instructor,
  "id" | "status"
>;