export interface ScoreDTO {
  nickname: string;
  totalCorrect: number;
  totalQuestions: number;
  score: number;       // Float in backend
  countryCode: string;
}


export interface ScoreSubmissionDTO {
  quizId: number;
  nickname: string;
  totalCorrect: number;
  countryCode: string;
}