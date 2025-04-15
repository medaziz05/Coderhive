export interface  SimilarTicketDTO {
    id: number;
    title: string;
    description: string;
    status: string;
    resolvedAt?: string;
    category: string;
    conversationId?: number;
  }