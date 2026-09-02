export interface Student {
  name: string;
  email: string;
  course: string;
  status: string;
}

export const students: Student[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    course: "React Mastery",
    status: "Active",
  },
  {
    name: "Sarah Ali",
    email: "sarah@example.com",
    course: "Node.js Bootcamp",
    status: "Active",
  },
  {
    name: "Michael Vance",
    email: "michael@example.com",
    course: "UI UX Design",
    status: "Pending",
  },
];