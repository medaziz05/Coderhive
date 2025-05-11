export interface AnswerDTO {
  answerLetter: string;
  answerTitle: string; 
}

export interface Answer {
  id: number;
  title: string;
  letter: string;
  questionId: number;
}