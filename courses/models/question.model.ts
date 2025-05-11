import { Answer, AnswerDTO } from "./answer.model";

export interface QuestionDTO {
  question: string;
  correctAnswerLetter: string;
  answers: AnswerDTO[];
}

export interface Question {
  id: number;
  title: string;
  correctAnswerLetter: string;
  answers: Answer[];
  quizId: number;
}