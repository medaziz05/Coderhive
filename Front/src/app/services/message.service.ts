import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // Add these imports
import { Message } from '../core/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8090/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(message: {
    conversationId: number;
    senderId: number;
    content: string;
  }): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, {
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content
    }, {
      observe: 'response'
    }).pipe(
      map((response: any) => { // Explicitly type the response
        if (response.status === 200 && response.body) {
          return response.body;
        }
        throw new Error('Invalid response from server');
      }),
      catchError((error: any) => { // Explicitly type the error
        console.error('Message send error:', error);
        throw error;
      })
    );
  }
    getMessagesByConversation(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation/${conversationId}`);
  }
}