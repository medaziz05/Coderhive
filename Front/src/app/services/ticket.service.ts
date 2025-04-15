import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { Ticket } from '../core/models/ticket.model';
import { Conversation } from '../core/models/conversation.model';
import {  SimilarTicketDTO } from 'src/app/core/models/similar-ticket';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:8090/api/tickets';

  constructor(private http: HttpClient) {}

  createTicket(ticket: TicketCreateDTO): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket).pipe(
      catchError(error => {
        console.error('Error creating ticket:', error);
        throw error;
      })
    );
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`).pipe(
      map(ticket => {
        // Calculer le temps de réponse estimé
        if (ticket.status !== 'RESOLVED') {
          ticket.estimatedResponseTime = this.calculateEstimatedTime(ticket);
        }
        return ticket;
      })
    );
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching tickets:', error);
        throw error;
      })
    );
  }

  getUserTickets(userId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(tickets => {
        // Pour chaque ticket, calculer le temps de réponse estimé
        return tickets.map(ticket => {
          // Calculer uniquement pour les tickets non résolus
          if (ticket.status !== 'RESOLVED') {
            ticket.estimatedResponseTime = this.calculateEstimatedTime(ticket);
          }
          return ticket;
        });
      })
    );
  }

  updateStatus(id: number, status: string): Observable<Ticket> {
    return this.http.patch<Ticket>(
      `${this.apiUrl}/${id}/status`,
      null,
      {
        params: { status },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error updating ticket status:', error);
        throw error;
      })
    );
  }

  createConversation(ticketId: number): Observable<Conversation> {
    return this.http.post<Conversation>(
      `${this.apiUrl}/${ticketId}/conversation`,
      {}
    ).pipe(
      catchError(error => {
        console.error('Error creating conversation:', error);
        throw error;
      })
    );
  }

/**
 * Get similar tickets for an existing ticket
 */
getSimilarTickets(ticketId: number): Observable< SimilarTicketDTO[]> {
  return this.http.get< SimilarTicketDTO[]>(`${this.apiUrl}/${ticketId}/similar`).pipe(
    catchError(error => {
      console.error('Error fetching similar tickets:', error);
      throw error;
    })
  );
}

/**
 * Check for similar tickets before creating a new one
 */
checkSimilarTickets(newTicket: TicketCreateDTO): Observable< SimilarTicketDTO[]> {
  return this.http.post< SimilarTicketDTO[]>(`${this.apiUrl}/check-similar`, newTicket).pipe(
    catchError(error => {
      console.error('Error checking similar tickets:', error);
      throw error;
    })
  );
}
 /**
   * Calcule le temps de réponse estimé en fonction des modèles de réponse de l'administrateur
   */
 private calculateEstimatedTime(ticket: Ticket): string {
  // S'il n'y a pas encore de conversation, fournir une estimation par défaut
  if (!ticket.conversation || !ticket.conversation.messages || ticket.conversation.messages.length === 0) {
    return this.getDefaultEstimatedTime(ticket.category);
  }

  // Filtrer les messages par administrateur (senderId === 0)
  const adminMessages = ticket.conversation.messages.filter(msg => msg.senderId === 0);
  
  if (adminMessages.length === 0) {
    // Pas encore de réponse de l'administrateur
    return this.getDefaultEstimatedTime(ticket.category);
  }

  // S'il y a des réponses d'administrateur, calculer en fonction de leurs modèles de réponse
  // Il s'agit d'une version simplifiée - vous voudrez peut-être créer un algorithme plus sophistiqué
  const responseTimesByCategory = this.getResponseTimesByCategory();
  
  if (ticket.status === 'IN_PROGRESS') {
    return '< 24 heures';
  } else {
    return responseTimesByCategory[ticket.category] || '48-72 heures';
  }
}

/**
 * Fournit des temps estimés par défaut en fonction de la catégorie du ticket
 */
private getDefaultEstimatedTime(category: string): string {
  const responseTimesByCategory = this.getResponseTimesByCategory();
  return responseTimesByCategory[category] || '48-72 heures';
}

/**
 * Renvoie les temps de réponse estimés par catégorie
 * Cela pourrait être récupéré à partir de la configuration ou calculé à partir de données historiques
 */
private getResponseTimesByCategory(): { [category: string]: string } {
  return {
    'Help & Support': '24-48 heures',
    'Refunds, Cancellations & Payments': '24-48 heures',
    'Hacked Account': '< 24 heures', // Haute priorité
    'Appeals & Age Update Requests': '48-72 heures',
    'Bug Reporting': '48-72 heures',
    'Feature Request': '72-96 heures'
  };
}
}

export interface TicketCreateDTO {
  title: string;
  description: string;
  category: string; // Already included and required
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  userId: number;
}