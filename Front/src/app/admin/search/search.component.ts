import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Complaint } from 'src/app/core/complaints';
import { ComplaintService } from 'src/app/services/complaint.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  // Event to emit search results to parent component
  @Output() searchResults = new EventEmitter<Complaint[]>();

  constructor(private complaintService: ComplaintService) { }

  ngOnInit(): void {
    // Set up debounced search for typing
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after the last event before emitting
      distinctUntilChanged() // Only emit if value is different from previous
    ).subscribe(term => {
      this.performSearch(term);
    });
  }

  // Method to handle input changes
  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  // Method to handle search button click
  searchComplaints(): void {
    this.performSearch(this.searchTerm);
  }

  // Method to clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.performSearch('');
  }

  // Method to perform the actual search
  private performSearch(term: string): void {
    this.complaintService.searchByTitle(term)
      .subscribe({
        next: (complaints) => {
          this.searchResults.emit(complaints);
        },
        error: (error) => {
          console.error('Error searching complaints:', error);
        }
      });
  }
}

