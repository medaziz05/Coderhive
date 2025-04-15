import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../core/models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  // conversation.service.ts
getConversationById(id: number) {
  return this.http.get<Conversation>(`${this.apiUrl}/conversations/${id}`);
}

createConversation(ticketId: number) {
  return this.http.post<Conversation>(`${this.apiUrl}/conversations/ticket/${ticketId}`, {});
}

closeConversation(conversationId: number) {
  return this.http.post(`${this.apiUrl}/conversations/close/${conversationId}`, {});
}

}