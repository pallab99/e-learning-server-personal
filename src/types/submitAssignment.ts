export interface ISubmitAssignment {
  title: string;
  description: string;
  assignmentFileURL: string;
  comments?: string[];
  disabled?: boolean;
  student: string;
  course: string;
  courseSection: string;
  assignment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
