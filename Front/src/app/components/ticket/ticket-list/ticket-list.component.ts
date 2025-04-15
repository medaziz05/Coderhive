import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { AuthService } from 'src/app/services/auth.service';
import { Ticket } from 'src/app/core/models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserTickets();
  }

  fetchUserTickets(): void {
    const userId = 2; // 👈 TEMP pour tester avec l'utilisateur user@user.com
    this.isLoading = true;
    this.errorMessage = '';
    this.ticketService.getUserTickets(userId).subscribe({
      next: (tickets) => {
        console.log('Fetched Tickets:', tickets);
        this.tickets = tickets;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Fetch Error:', err);
        this.errorMessage = 'Failed to load tickets. Please try again.';
        this.isLoading = false;
      }
    });
  }

  viewTicketDetails(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId]);
  }

  truncateDescription(desc: string, length: number): string {
    return desc.length > length ? desc.slice(0, length) + '...' : desc;
  }

  // Nouvelle méthode pour obtenir la classe CSS pour le temps estimé
  getEstimatedTimeClass(estimatedTime: string | undefined): string {
    if (!estimatedTime) return '';
    
    if (estimatedTime.includes('< 24')) {
      return 'estimated-time-urgent';
    } else if (estimatedTime.includes('24-48')) {
      return 'estimated-time-normal';
    } else {
      return 'estimated-time-long';
    }
  }
}