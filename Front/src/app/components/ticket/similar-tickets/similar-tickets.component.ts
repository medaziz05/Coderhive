// similar-tickets.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import {  SimilarTicketDTO } from 'src/app/core/models/similar-ticket';
import { Ticket } from 'src/app/core/models/ticket.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-similar-tickets',
  templateUrl: './similar-tickets.component.html',
  styleUrls: ['./similar-tickets.component.css']
})
export class SimilarTicketsComponent implements OnInit {
  @Input() ticket!: Ticket;
  SimilarTicketDTO:  SimilarTicketDTO[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.ticket && this.ticket.id) {
      this.loadSimilarTickets();
    }
  }

  loadSimilarTickets(): void {
    this.isLoading = true;
    this.ticketService.getSimilarTickets(this.ticket.id).subscribe({
      next: (tickets:  SimilarTicketDTO[]) => {
        this. SimilarTicketDTO = tickets;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load similar tickets:', err);
        this.errorMessage = 'Failed to load similar tickets.';
        this.isLoading = false;
      }
    });
  }

  viewTicket(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId]);
  }

  viewConversation(conversationId: number): void {
    this.router.navigate(['/conversation', conversationId]);
  }
}
