import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Hackathon } from 'src/app/models/hackathon';
import { HackathonService } from 'src/app/services/hackathon.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-admin-hackathon-list',
  templateUrl: './admin-hackathon-list.component.html',
  styleUrls: ['./admin-hackathon-list.component.css'],
})
export class AdminHackathonListComponent implements OnInit {
  math = Math;
  allHackathons: Hackathon[] = [];
  filteredHackathons: Hackathon[] = [];
  displayedHackathons: Hackathon[] = [];
  currentPage = 0;
  pageSize = 5;

  searchForm: FormGroup;

  constructor(
    private hackathonService: HackathonService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTitle: [''],
      searchDescription: [''],
      searchStartTime: [''],
      searchLocation: [''],
    });
  }

  ngOnInit() {
    this.loadAllHackathons();

    // Écouter les changements dans le formulaire de recherche
    this.searchForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.searchHackathons();
      });
  }

  loadAllHackathons() {
    this.hackathonService.getAllHackathons(0, 1000).subscribe({
      next: (response) => {
        this.allHackathons = response.content;
        this.filteredHackathons = this.allHackathons;
        this.currentPage = 0;
        this.updateDisplayedHackathons();
      },
      error: (error) => {
        console.error('Error loading hackathons:', error);
      },
    });
  }

  updateDisplayedHackathons() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedHackathons = this.filteredHackathons.slice(start, end);
  }

  loadPage(page: number) {
    if (page < 0 || page >= Math.ceil(this.filteredHackathons.length / this.pageSize)) {
      return;
    }
    this.currentPage = page;
    this.updateDisplayedHackathons();
  }

  searchHackathons(): void {
    const { searchTitle, searchDescription, searchStartTime, searchLocation } = this.searchForm.value;

    this.filteredHackathons = this.allHackathons.filter((hackathon) => {
      const matchesTitle = searchTitle
        ? hackathon.title.toLowerCase().includes(searchTitle.toLowerCase())
        : true;
      const matchesDescription = searchDescription
        ? hackathon.description.toLowerCase().includes(searchDescription.toLowerCase())
        : true;
      const matchesLocation = searchLocation
        ? (hackathon.location || '').toLowerCase().includes(searchLocation.toLowerCase())
        : true;
      const matchesStartTime = searchStartTime
        ? new Date(hackathon.startTime).toISOString().slice(0, 10) === searchStartTime
        : true;
      return matchesTitle && matchesDescription && matchesLocation && matchesStartTime;
    });

    this.currentPage = 0;
    this.updateDisplayedHackathons();
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.filteredHackathons = this.allHackathons;
    this.currentPage = 0;
    this.updateDisplayedHackathons();
  }

  onDeleteHackathon(hackathonId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.hackathonService.deleteHackathon(hackathonId).subscribe({
        next: () => {
          alert('Hackathon deleted successfully!');
          this.loadAllHackathons();
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to delete hackathon');
        },
      });
    }
  }
}