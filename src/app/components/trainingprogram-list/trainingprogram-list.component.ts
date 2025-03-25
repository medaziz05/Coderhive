import { Component, type OnInit } from "@angular/core"
import  { TrainingProgram } from "src/app/models/trainingprogram"
import  { TrainingprogramService } from "src/app/services/trainingprogram.service"
import  { SuggestionService } from "src/app/services/suggestion.service"
import { ParticipantService } from 'src/app/services/participant.service';
import { AuthService } from "src/app/auth.service";
@Component({
  selector: "app-training-program-list",
  templateUrl: "./trainingprogram-list.component.html",
  styleUrls: ["./trainingprogram-list.component.css"],
})
export class TrainingProgramListComponent implements OnInit {
  trainingPrograms: TrainingProgram[] = []
  message: string = '';
  filteredAndSortedTrainingPrograms: TrainingProgram[] = []
  searchQuery = ""
  sortOption = ""
  priceFilter = ""
  page = 1
  pageSize = 4 // Changed to 4 programs per page
  totalItems = 0
  suggestionsMap: { [key: number]: any[] } = {}

  // For UI display
  viewMode = "list" // 'list' or 'grid'

  constructor(
    private trainingProgramService: TrainingprogramService,
    private suggestionService: SuggestionService,
    private authService: AuthService,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.getTrainingPrograms()
  }

  // Récupérer les programmes de formation
  getTrainingPrograms(): void {
    this.trainingProgramService.getAllTrainingPrograms().subscribe({
      next: (response) => {
        this.trainingPrograms = response
        this.applyFiltersAndSorting()
      },
      error: (error) => {
        console.error("Error fetching training programs:", error)
      },
    })
  }

  // Appliquer la recherche, le tri et la pagination
  applyFiltersAndSorting(): void {
    let filteredPrograms = this.trainingPrograms

    // Recherche par nom
    if (this.searchQuery) {
      filteredPrograms = filteredPrograms.filter((program) =>
        program.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    }

    // Filtre par prix
    if (this.priceFilter === "low_to_high") {
      filteredPrograms = [...filteredPrograms].sort((a, b) => a.price - b.price)
    } else if (this.priceFilter === "high_to_low") {
      filteredPrograms = [...filteredPrograms].sort((a, b) => b.price - a.price)
    }

    // Tri alphabétique
    if (this.sortOption === "program_title_az") {
      filteredPrograms = [...filteredPrograms].sort((a, b) => a.title.localeCompare(b.title))
    } else if (this.sortOption === "program_title_za") {
      filteredPrograms = [...filteredPrograms].sort((a, b) => b.title.localeCompare(a.title))
    }

    // Mettre à jour les programmes filtrés et triés
    this.filteredAndSortedTrainingPrograms = filteredPrograms
    this.totalItems = filteredPrograms.length
    this.updatePagination()
  }

  // Méthode pour la recherche
  onSearch(): void {
    this.page = 1 // Reset to first page when searching
    this.applyFiltersAndSorting()
  }

  // Méthode pour le tri
  onSort(): void {
    this.page = 1 // Reset to first page when sorting
    this.applyFiltersAndSorting()
  }

  // Méthode pour le filtre de prix
  onPriceFilter(): void {
    this.page = 1 // Reset to first page when filtering
    this.applyFiltersAndSorting()
  }

  // Pagination - obtenir les programmes paginés
  get paginatedTrainingPrograms(): TrainingProgram[] {
    const startIndex = (this.page - 1) * this.pageSize
    return this.filteredAndSortedTrainingPrograms.slice(startIndex, startIndex + this.pageSize)
  }

  // Nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.filteredAndSortedTrainingPrograms.length / this.pageSize)
  }

  // Numéros de pages pour la pagination
  pageNumbers(): number[] {
    const pageCount = this.totalPages
    const maxVisiblePages = 5 // Maximum number of page numbers to show

    if (pageCount <= maxVisiblePages) {
      // If we have fewer pages than the max visible, show all pages
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }

    // Calculate the range of page numbers to display
    let startPage = Math.max(1, this.page - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1

    // Adjust if we're near the end
    if (endPage > pageCount) {
      endPage = pageCount
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  // Changer de page
  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage
    }
  }

  // Mettre à jour la pagination
  updatePagination(): void {
    if (this.page > this.totalPages && this.totalPages > 0) {
      this.page = this.totalPages
    } else if (this.page < 1) {
      this.page = 1
    }
  }

  // Toggle view mode between list and grid
  toggleViewMode(mode: string): void {
    this.viewMode = mode
  }

  enroll(trainingId: number): void {
    const userId = this.authService.getLoggedUserId();
    if (!userId) {
      this.message = "Veuillez vous connecter d'abord.";
      return;
    }
  
    this.participantService.enrollParticipant(userId, trainingId)
      .subscribe({
        next: () => this.message = "Inscription réussie 🎉",
        error: () => this.message = "Erreur d'inscription ❌"
      });
  }
  
}


