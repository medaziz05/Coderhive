import { Answer } from './answer';

export interface Question {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  quizId?: number;
  answers?: Answer[];
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  TRUE_FALSE = 'TRUE_FALSE',
}
