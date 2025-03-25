export enum ParticipantStatus {
  ENROLLED = 'ENROLLED',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
}

export interface Participant {
  id?: number;
  userId: number;
  trainingProgramId: number;
  status: ParticipantStatus;
  grade: number;
}
