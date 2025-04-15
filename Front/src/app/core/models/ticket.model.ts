import { Conversation } from './conversation.model';

export interface Ticket {
  id: number;  // Changed from optional to required since backend always provides it
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  category: string; // Changed from optional to required
  userId: number; // Changed from optional to required
  createdAt: string; // Changed to string to match backend serialization
  updatedAt: string; // Changed to string to match backend serialization
  conversation?: Conversation;
  estimatedResponseTime?: string;
}