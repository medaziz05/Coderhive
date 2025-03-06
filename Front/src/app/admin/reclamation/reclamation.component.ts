import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint,ComplaintPriority } from '../../core/complaints';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComplaintResponse } from 'src/app/core/ComplaintResponse';
import { MatDialog } from '@angular/material/dialog';
import { ResponseComponent } from '../response/response.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = []; // To store search results
  statistics: any; // Add a property to hold statistics
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  responseMessage: string = ''; // Message for the response
  selectedComplaintId: number | null = null; // Store the selected complaint ID for response
  newDate: string = ''; // Initialize with an empty string
  oldDate: string = ''; // Initialize with an empty string
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = ''; // To store the search term
  private searchSubject = new Subject<string>(); // For debounced search
  isSearching: boolean = false; 
  expandedIndex: number = -1;// Track search state

  constructor(
    private complaintService: ComplaintService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('Initializing ReclamationComponent');
    this.loadComplaints();
    this.loadStatistics(); // Load statistics on initialization

    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after the last event before emitting
      distinctUntilChanged() // Only emit if value is different from previous
    ).subscribe(term => {
      this.performSearch(term);
    });
  }

  loadComplaints(): void {
    this.complaintService.getAllComplaints().subscribe((data: Complaint[]) => {
      this.complaints = data;
      this.filteredComplaints = data; // Initialize filtered complaints with all complaints
      console.log('Fetched complaints:', this.complaints);
    });
  }

  loadStatistics(): void {
    this.complaintService.getStatistics().subscribe((data) => {
      this.statistics = data; // Store the statistics data
      console.log('Fetched statistics:', this.statistics);
    }, (error) => {
      console.error('Error fetching statistics:', error);
    });
  }

  // Method to handle search input changes
  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  // Method for immediate search on button click
  searchComplaints(): void {
    this.performSearch(this.searchTerm);
  }

  // Method to clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredComplaints = this.complaints;
    this.isSearching = false;
    this.currentPage = 1; // Reset to first page
  }

  // Method to perform the actual search
  private performSearch(term: string): void {
    this.isSearching = true;

    if (!term || term.trim() === '') {
      this.filteredComplaints = this.complaints;
      this.isSearching = false;
      return;
    }

    // Filter complaints by title (case-insensitive)
    this.complaintService.searchByTitle(term).subscribe({
      next: (results) => {
        this.filteredComplaints = results;
        this.currentPage = 1; // Reset to first page when search results change
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error searching complaints:', error);
        this.snackBar.open('Error searching complaints', 'Close', { duration: 3000 });
        this.isSearching = false;
      }
    });
  }

  // Method to handle pagination - now uses filteredComplaints
  get paginatedComplaints(): Complaint[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredComplaints.slice(start, start + this.itemsPerPage);
  }

  // Method to calculate total pages - now uses filteredComplaints
  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredComplaints.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  // Method to change page
  changePage(page: number): void {
    this.currentPage = page;
  }

  // Method to delete a complaint
  deleteComplaint(id: number): void {
    console.log('Deleting complaint with ID:', id);
    this.complaintService.deleteComplaint(id).subscribe({
      next: () => {
        this.loadComplaints(); // Reload complaints after deletion
        this.openSnackBar('Complaint deleted successfully!', 'Close');
      },
      error: (err) => {
        console.error('Error deleting complaint:', err);
        this.openSnackBar('Failed to delete complaint.', 'Close');
      }
    });
  }

  declineComplaint(id: number): void {
    this.complaintService.declineComplaint(id).subscribe({
      next: (declinedComplaint) => {
        this.loadComplaints(); // Reload complaints after declining
        this.openSnackBar('Complaint declined successfully!', 'Close'); // Show snackbar
      },
      error: (err) => {
        console.error('Error declining complaint:', err); // Log any errors
        this.openSnackBar('Failed to decline complaint.', 'Close'); // Show error snackbar
      }
    });
  }

  // Method to open snackbar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
    });
  }

  logDelete(id: number | undefined): void {
    if (id !== undefined) {
      console.log('Delete button clicked for ID:', id);
    } else {
      console.log('ID is undefined');
    }
  }

  respondToComplaint(complaint: Complaint): void {
    this.selectedComplaintId = complaint.idcomplaint || null;
  }

  getEmailForSelectedComplaint(): string {
    const complaint = this.complaints.find(c => c.idcomplaint === this.selectedComplaintId);
    return complaint ? complaint.mail : 'no-email@istudy.com';
  }

  handleResponseCancel(): void {
    this.selectedComplaintId = null;
  }

  submitResponse(): void {
    if (this.selectedComplaintId && this.responseMessage) {
      const response: ComplaintResponse = {
        message: this.responseMessage,
        date: new Date()
      };

      this.complaintService.createResponse(this.selectedComplaintId, response).subscribe({
        next: () => {
          this.snackBar.open('Response submitted & user notified via email!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadComplaints();
          this.selectedComplaintId = null;
          this.responseMessage = '';
        },
        error: (err) => {
          console.error('Error submitting response:', err);
          const errorMessage = err.message.includes('email')
            ? 'Response saved but email failed to send'
            : 'Failed to submit response';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please enter a response message.', 'Close', { duration: 3000 });
    }
  }

  // Updated handleResponseSubmitted()
  handleResponseSubmitted(responseMessage: string): void {
    if (this.selectedComplaintId && responseMessage) {
      const response: ComplaintResponse = {
        message: responseMessage,
        date: new Date()
      };

      this.complaintService.createResponse(this.selectedComplaintId, response).subscribe({
        next: () => {
          this.snackBar.open('Response submitted & email sent!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadComplaints();
          this.selectedComplaintId = null;
        },
        error: (err) => {
          console.error('Error submitting response:', err); // Log the full error response
          const errorMessage = err.error?.message || 'Submission error'; // Use error message from response if available
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancelResponse(): void {
    this.selectedComplaintId = null; // Reset the selected complaint ID
    this.responseMessage = ''; // Clear the response message
  }

  filterComplaints(newDate: string, oldDate: string) {
    this.complaintService.getComplaintsFromNewToOld(newDate, oldDate).subscribe(
      (complaints: Complaint[]) => {
        this.complaints = complaints;
        this.filteredComplaints = complaints; // Update filtered complaints as well
        this.searchTerm = ''; // Clear search when filtering by date
        console.log('Filtered complaints:', this.complaints);
      },
      error => {
        console.error('Error fetching filtered complaints:', error);
      }
    );
  }

  sortComplaints(order: 'asc' | 'desc') {
    this.sortDirection = order; // Update the current sort direction
    this.filteredComplaints.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  toggleExpandedRow(index: number): void {
    if (this.expandedIndex === index) {
      // Si on clique sur une ligne déjà développée, on la replie
      this.expandedIndex = -1;
    } else {
      // Sinon, on développe la ligne cliquée
      this.expandedIndex = index;
    }
  }
  getPriorityClass(priority: ComplaintPriority): string {
    switch(priority) {
      case ComplaintPriority.LOW:
        return 'priority-low';
      case ComplaintPriority.MEDIUM:
        return 'priority-medium';
      case ComplaintPriority.HIGH:
        return 'priority-high';
      default:
        return '';
    }
  }
}
