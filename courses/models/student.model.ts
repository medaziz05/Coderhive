export interface Student {
  studentId: number;          // Maps to Long in Java
  studentName: string;        // Maps to studentName
  studentMembership: boolean; // Maps to studentMembership
  courses?: any[];            // Optional array for course relationships
}