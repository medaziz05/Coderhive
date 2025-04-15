export interface Message {
  id?: number;
  content: string;
  senderId: number;
  sentAt?: Date;
  conversationId: number;
  createdAt?: string; 
  // 👈 ajoute ça

}

