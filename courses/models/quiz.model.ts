import {  Question, QuestionDTO } from "./question.model";

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}


export interface Quiz {
  id: number;
  title: string;
  categoryName: string;
  numberOfQuestions: number;
  difficulty: Difficulty;
  questions: Question[];
  created: Date;
  chapterId: number;
  courseId: number;
  uniqueCode?: string;
  photoPath?: string;
}

export interface QuizSimple {
  id: number;
  title: string;
  category: string; 
  totalQuestions: number;
}

export interface QuizCreationRequest {
  topic: string;
  difficulty: Difficulty;
  numberOfQuestions: number;
}
export interface QuizCreationResponse {
  id: number;
  title: string;
  categoryName: string;
  numberOfQuestions: number;
  difficulty: Difficulty;
  questions: QuestionDTO[];
  created: Date;
  chapterId: number;
  courseId: number;
  uniqueCode?: string;
}

export interface QuizScoreSubmission {
  quizId: number;
  nickname: string;
  totalCorrect: number;
  countryCode: string;
}

export interface QuizDocument {
  id: number;
  title: string;
  category: string; 
  difficulty: string;
  questions: number;
  created: Date;
  chapterId: number;
  _difficulty?: number;
}


export interface QuizDTO {
  id: number;
  title: string;
  category : string;
  numberOfQuestions: number;
  difficulty: Difficulty;
  questions: QuestionDTO[];
  created: Date;
  chapterId: number;
  courseId: number;
  uniqueCode?: string;
}