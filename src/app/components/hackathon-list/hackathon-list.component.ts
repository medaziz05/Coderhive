import { Component, OnInit } from '@angular/core';
import { Hackathon } from 'src/app/models/hackathon';
import { HackathonParticipation } from 'src/app/models/hackathon-participation';
import { PageResponse } from 'src/app/models/post';
import { HackathonParticipationService } from 'src/app/services/hackathon-participation.service';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-hackathon-list',
  templateUrl: './hackathon-list.component.html',
  styleUrls: ['./hackathon-list.component.css'],
})
export class HackathonListComponent implements OnInit {
  hackathons!: PageResponse<Hackathon>;
  currentPage: number = 1;
  pageSize: number = 3; // 3 hackathons maximum par catégorie par page
  totalPages: number = 1;
  currentUserId: number = 1;

  // Tableaux d'origine
  joinedHackathons!: Hackathon[];
  unjoinedHackathons!: Hackathon[];

  // Tableaux filtrés affichés dans la vue
  filteredJoinedHackathons!: Hackathon[];
  filteredUnjoinedHackathons!: Hackathon[];

  participantHackathon!: HackathonParticipation[];

  // Champs de recherche
  searchTitle: string = '';
  searchDescription: string = '';
  // Continent sélectionné (sera utilisé pour filtrer par ville)
  selectedContinent: string = '';

  // Contrôle l'affichage de la modal de la carte
  showMap: boolean = false;

  // Mapping continent -> liste de villes (en minuscules)
  continentMapping: { [key: string]: string[] } = {
    Europe: ['paris', 'madrid', 'melun', 'london', 'berlin', 'rome', 'barcelona', 'vienna'],
    Asie: ['tokyo', 'seoul', 'beijing', 'delhi', 'singapore'],
    Afrique: ['cairo', 'nairobi', 'casablanca'],
    'Amérique': ['new york', 'los angeles', 'toronto', 'mexico city'],
    Océanie: ['sydney', 'melbourne', 'auckland']
  };

  constructor(
    private hackathonService: HackathonService,
    private participationService: HackathonParticipationService
  ) {}

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.hackathonService.getAllHackathons().subscribe({
      next: (response) => {
        this.hackathons = response;
        this.joinedHackathons = [];
        this.unjoinedHackathons = [];
        this.hackathons.content.forEach((hackathon) => {
          const isJoined = hackathon.participations.some(
            (participation) => participation.userId === this.currentUserId
          );
          if (isJoined) {
            this.joinedHackathons.push(hackathon);
          } else {
            this.unjoinedHackathons.push(hackathon);
          }
        });
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading hackathons:', error);
      }
    });
  }

  // Applique le filtrage sur Titre, Description et Localisation
  applyFilter() {
    this.filteredJoinedHackathons = this.joinedHackathons.filter((hackathon) => {
      const matchesTitle = hackathon.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesDescription = hackathon.description.toLowerCase().includes(this.searchDescription.toLowerCase());
      let matchesContinent = true;
      if (this.selectedContinent) {
        const cities = this.continentMapping[this.selectedContinent] || [];
        matchesContinent = cities.includes(hackathon.location.toLowerCase());
      }
      return matchesTitle && matchesDescription && matchesContinent;
    });

    this.filteredUnjoinedHackathons = this.unjoinedHackathons.filter((hackathon) => {
      const matchesTitle = hackathon.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesDescription = hackathon.description.toLowerCase().includes(this.searchDescription.toLowerCase());
      let matchesContinent = true;
      if (this.selectedContinent) {
        const cities = this.continentMapping[this.selectedContinent] || [];
        matchesContinent = cities.includes(hackathon.location.toLowerCase());
      }
      return matchesTitle && matchesDescription && matchesContinent;
    });

    this.calculateTotalPages();
  }

  // Méthode appelée lors de la modification des champs de recherche (pour la recherche dynamique)
  onSearchChange() {
    this.currentPage = 1;
    this.applyFilter();
  }

  resetFilter() {
    this.searchTitle = '';
    this.searchDescription = '';
    this.selectedContinent = '';
    this.currentPage = 1;
    this.applyFilter();
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  selectContinent(continent: string) {
    this.selectedContinent = continent;
    this.showMap = false;
    this.currentPage = 1;
    this.applyFilter();
  }

  // Renvoie les hackathons paginés pour "Mes Hackathons"
  getPaginatedJoinedHackathons(): Hackathon[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredJoinedHackathons.slice(startIndex, startIndex + this.pageSize);
  }

  // Renvoie les hackathons paginés pour "Autres Hackathons"
  getPaginatedUnjoinedHackathons(): Hackathon[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUnjoinedHackathons.slice(startIndex, startIndex + this.pageSize);
  }

  calculateTotalPages() {
    const totalPagesJoined = Math.ceil(this.filteredJoinedHackathons.length / this.pageSize);
    const totalPagesUnjoined = Math.ceil(this.filteredUnjoinedHackathons.length / this.pageSize);
    this.totalPages = Math.max(totalPagesJoined, totalPagesUnjoined) || 1;
  }

  // Méthode pour générer un tableau d'indices de pages
  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  goToPage(page: number, event: Event) {
    event.preventDefault();
    this.currentPage = page;
  }

  previousPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onDeleteHackathon(hackathonId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.hackathonService.deleteHackathon(hackathonId).subscribe({
        next: () => {
          alert('Hackathon deleted successfully!');
          location.reload();
        },
        error: (error) => {
          console.error('Error deleting hackathon:', error);
          alert('Failed to delete hackathon');
        }
      });
    }
  }
}
