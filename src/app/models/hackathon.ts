import { HackathonParticipation } from './hackathon-participation';

export enum DifficultyLevel {
  VERY_DIFFICULT = 'TRESDIFFICILE',
  DIFFICULT = 'DIFFICILE',
  MEDIUM = 'MOYEN',
  EASY = 'FACILE',
}

export enum ImportanceLevel {
  VERY_IMPORTANT = 'TRESIMPORTANT',
  IMPORTANT = 'IMPORTANT',
  MEDIUM = 'MOYEN',
  LESS_IMPORTANT = 'PEUIMPORTANT',
}
export interface Hackathon {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  nbrPlaces: number;
  createdAt: Date;
  niveauDifficulte: DifficultyLevel;
  niveauImportance: ImportanceLevel;
  participations: HackathonParticipation[];
}
