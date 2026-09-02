export type AssignmentId = string;
export type SubmissionId = string;

export type AssignmentAvailability = "Open" | "Closed";

export interface StudentAssignment {
  id: AssignmentId;
  title: string;
  course: string;
  instructor: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  status: AssignmentAvailability;
}

export interface AssignmentSubmission {
  id: SubmissionId;
  assignmentId: AssignmentId;
  content: string;
  submittedAt: string;
  updatedAt: string | null;
}