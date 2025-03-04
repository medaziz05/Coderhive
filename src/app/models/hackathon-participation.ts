import { Hackathon } from './hackathon';

export interface HackathonParticipation {
  id: number;
  joinHackathonTime: Date;
  hackathonId: number;
  userId: number;
  hackathon?: Hackathon; // Optional since it might not always be loaded
}
