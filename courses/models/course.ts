import { Chapter } from './chapter';

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  MID_LVL = 'MID_LVL',
  ADVANCED = 'ADVANCED',
}

export interface TeacherSimple {
  teacherId: number;
  name: string;
}

export interface TeacherSimple {
  teacherId: number;
  name: string;
  speciality: string;
}

export interface CourseList {
  courseId: number;
  courseTitle: string;
  courseCategory: string;
  coursePaid: boolean;
  courseImage: string;
  teacher: TeacherSimple;
  level: CourseLevel; // Updated to CourseLevel enum type
}

export interface CourseDetails {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseCategory: string;
  coursePaid: boolean;
  level: CourseLevel; // Updated to CourseLevel enum type
  courseImage: string;
  courseCreatedAt: Date | null; // Allow null if the date is invalid
  courseUpdatedAt: Date | null; // Allow null if the date is invalid
  teacher: TeacherSimple;
  chapters: Chapter[]; // Chapters should be an array of Chapter objects
  avgRating: number;      // Add avgRating
  ratingCount: number; 

}

export interface CourseRequest {
  courseTitle: string;
  courseCategory: string;
  courseDescription: string;
  coursePaid: boolean;
  level: CourseLevel; // Level as CourseLevel enum type
  courseImage?: string;
}
