import { Message } from './message.model';

export interface Conversation {
  id?: number;
  ticketId?: number;
  active: boolean;
  closed: boolean;
  closedAt?: Date;
  createdAt?: Date;
  messages?: Message[];
  
}
