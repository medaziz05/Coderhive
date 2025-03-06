import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Complaint } from 'src/app/core/complaints';
import { ComplaintService } from 'src/app/services/complaint.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  ngOnInit(): void {
    this.loadComplaints();
    setTimeout(() => {
      let loader = document.getElementById('loading');
      if (loader) {
        loader.remove(); // Masquer le loader après 2 secondes
      }
    }, 1000);
  }
  complaints: Complaint[] = [];
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page

  constructor(private complaintService: ComplaintService) {}

  loadComplaints(): void {
    this.complaintService.getAllComplaints().subscribe((data: Complaint[]) => {
      this.complaints = data;
    });
  }

  // Method to handle pagination
  get paginatedComplaints(): Complaint[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.complaints.slice(start, start + this.itemsPerPage);
  }

  // Method to change page
  changePage(page: number): void {
    this.currentPage = page;
  }
}
