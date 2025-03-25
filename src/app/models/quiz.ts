import { Question } from './question';

export interface Quiz {
  id?: number;
  title: string;
  passingScore: number;
  moduleId: number;
  questions?: Question[];
}
