import { Module } from './module';
import { Content } from 'src/app/models/content';

export interface TrainingProgram {

  id?: number;
  title: string;
  description: string;
  duration: number;
  prerequisites: string;
  objectives: string;
  price: number;
  currency: Currency;
  trainerId: number;
  modules: Module[]; 
  Contents:Content[];
  startDate: Date; 
  endDate: Date; 
}

export enum Currency {
  TND = 'TND',
  USD = 'USD',
  EUR = 'EUR',
}
