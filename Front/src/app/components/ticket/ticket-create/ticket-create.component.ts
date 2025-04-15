// Update to TicketCreateComponent
import { Component } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { Router } from '@angular/router';
import {  SimilarTicketDTO } from 'src/app/core/models/similar-ticket';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent {
  ticket: any = {
    title: '',
    description: '',
    category: '',
    status: 'OPEN',
    userId: 2
  };

  categories: string[] = [
    'Help & Support',
    'Refunds, Cancellations & Payments',
    'Hacked Account',
    'Appeals & Age Update Requests',
    'Bug Reporting',
    'Feature Request'
  ];

  categoryFields: { [key: string]: { label: string, model: string, placeholder?: string }[] } = {
    'Refunds, Cancellations & Payments': [
      { label: 'Order ID', model: 'orderId', placeholder: 'e.g. #ORD10233' },
      { label: 'Reason for refund', model: 'refundReason', placeholder: 'Describe your reason' }
    ],
    'Hacked Account': [
      { label: 'Username affected', model: 'hackedUsername', placeholder: 'e.g. user123' },
      { label: 'Last login date', model: 'lastLogin', placeholder: 'e.g. 2025-04-01' }
    ],
    'Bug Reporting': [
      { label: 'Platform', model: 'bugPlatform', placeholder: 'e.g. Android / Web / iOS' },
      { label: 'Steps to reproduce', model: 'reproductionSteps', placeholder: '1. Open app\n2. Click on button\n3. See error' }
    ]
  };

  isLoading = false;
  errorMessage = '';
  
  // New properties for similar tickets
  similarTickets:  SimilarTicketDTO[] = [];
  showSimilarTicketsModal = false;
  checkingForSimilarTickets = false;

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  onSubmit() {
    // First check for similar tickets
    this.checkSimilarTickets();
  }

  checkSimilarTickets() {
    // Only check if we have title and description
    if (!this.ticket.title || !this.ticket.description) {
      this.createTicket(); // Skip checking if incomplete data
      return;
    }

    this.checkingForSimilarTickets = true;
    this.ticketService.checkSimilarTickets(this.ticket).subscribe({
      next: (similarTickets:  SimilarTicketDTO[]) => {
        this.similarTickets = similarTickets;
        this.checkingForSimilarTickets = false;
        
        if (similarTickets.length > 0) {
          this.showSimilarTicketsModal = true;
        } else {
          this.createTicket(); // No similar tickets found, proceed with creation
        }
      },
      error: (err) => {
        console.error('Error checking similar tickets:', err);
        this.checkingForSimilarTickets = false;
        this.createTicket(); // Proceed anyway if error checking
      }
    });
  }

  createTicket() {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.createTicket(this.ticket).subscribe({
      next: (ticket) => {
        this.router.navigate(['/tickets', ticket.id]);
      },
      error: () => {
        this.errorMessage = 'Failed to create ticket.';
        this.isLoading = false;
      }
    });
  }

  continueWithTicketCreation() {
    this.showSimilarTicketsModal = false;
    this.createTicket();
  }

  cancelTicketCreation() {
    this.showSimilarTicketsModal = false;
    this.isLoading = false;
  }

  viewSimilarTicket(ticketId: number) {
    this.router.navigate(['/tickets', ticketId]);
  }

  viewSimilarConversation(conversationId: number) {
    this.router.navigate(['/conversation', conversationId]);
  }

  navigateToTickets() {
    this.router.navigate(['/tickets']);
  }

  get dynamicFields() {
    return this.categoryFields[this.ticket.category] || [];
  }
}