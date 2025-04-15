import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/core/models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket!: Ticket;
  isLoading = false;
  errorMessage = '';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(+id);
    }
    // Pour déterminer si l'utilisateur est un administrateur
    // Vous devriez idéalement utiliser votre service d'authentification
    this.isAdmin = false; // Pour les utilisateurs normaux, nous voulons afficher le temps estimé
  }

  loadTicket(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getTicket(id).subscribe({
      next: (ticket: Ticket) => {
        this.ticket = ticket;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load ticket details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  retryLoading(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(+id);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'badge-open';
      case 'IN_PROGRESS':
        return 'badge-progress';
      case 'RESOLVED':
        return 'badge-resolved';
      default:
        return '';
    }
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

  navigateToTickets(): void {
    this.router.navigate(['/tickets']);
  }
}