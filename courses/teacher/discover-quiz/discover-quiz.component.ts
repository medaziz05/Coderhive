import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Quiz, QuizDocument } from '@app/courses/models/quiz.model';
import { SearchDTO } from '@app/courses/models/search.model';
import { Page, QuizService } from '@app/courses/services/quiz.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


 
interface SearchOptions {
  page?: number;
  size?: number;
  title?: string;
  categoryName?: string;
  difficulty?: string;
  numberOfQuestions?: string | number;
  sortByDifficulty?: 'ASC' | 'DESC' | undefined;  // Changed to uppercase
  sortByCreatedDate?: 'ASC' | 'DESC' | undefined;
}

@Component({
  selector: 'app-discover-quiz',
  templateUrl: './discover-quiz.component.html',
  styleUrls: ['./discover-quiz.component.scss']
})
export class DiscoverQuizComponent implements OnInit{

  courseCategories: string[] = [];
  quizzes: QuizDocument[] = [];
  isLastPage = false;
  isFirstPage = false;
  isLoading = true;
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;
  searchOptions: SearchOptions = {
    categoryName: '', // Changed from categoryId
    difficulty: '',
    page: 0,
    numberOfQuestions: '', 
    size: 6,
    title: '',
  sortByDifficulty: 'ASC',  // Changed to lowercase
  sortByCreatedDate: 'DESC'
  };
  
  protected readonly apiBase = environment.apiBase;
  constructor(private quizService: QuizService,
              private router: Router,
              private toastr: ToastrService,
              private route: ActivatedRoute) {
  }

  computeSearchParams() {
    return Object.entries(this.searchOptions)
      .filter(([key, value]) => !!value) // Filter out falsy values
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {});
  }

  mergeSearchOptionsWithRouteQueryParams() {
    this.route.queryParams.subscribe(params => {
      this.searchOptions = { ...this.searchOptions, ...params };
    });
  }

  ngOnInit(): void {
    this.mergeSearchOptionsWithRouteQueryParams();
    this.courseCategories = this.getUniqueCourseCategories();
    // Convert string parameters to numbers where needed
    this.searchOptions.page = Number(this.searchOptions.page) || 0;
    this.searchOptions.size = Number(this.searchOptions.size) || 6;
    this.loadQuizzes();
  }

  // Updated loadQuizzes() method
// Updated loadQuizzes() method
loadQuizzes() {
  const searchDTO: SearchDTO = {
    ...this.searchOptions,
    numberOfQuestions: this.searchOptions.numberOfQuestions 
      ? Number(this.searchOptions.numberOfQuestions) 
      : undefined,
    sortByCreatedDate: this.searchOptions.sortByCreatedDate,
    sortByDifficulty: this.searchOptions.sortByDifficulty
  };

  this.isLoading = true;
  
  this.quizService.search(searchDTO).subscribe({
    next: (page: Page<QuizDocument>) => {  // Changed to Page<QuizDocument>
      this.quizzes = page.content || [];
      
      // Extract pagination info from page object
      this.totalElements = page.totalElements;
      this.totalPages = page.totalPages;
      this.currentPage = page.pageable.pageNumber;
      
      this.isFirstPage = page.first;
      this.isLastPage = page.last;
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;
      this.toastr.error('Failed to load quizzes');
    }
  });
}
  goToPage(event: Event, displayPage: number) {
    event.preventDefault();
    const backendPage = displayPage - 1; // Convert UI page to zero-based
    this.searchOptions.page = backendPage;
    this.onSearch();
  }

  goToPrevPage(event: Event) {
    event.preventDefault();
    if (!this.isFirstPage) {
      this.searchOptions.page = this.currentPage - 1;
      this.onSearch();
    }
  }

  goToNextPage(event: Event) {
    event.preventDefault();
    if (!this.isLastPage) {
      this.searchOptions.page = this.currentPage + 1;
      this.onSearch();
    }
  }
  
  getPageNumbers(maxPagesToShow = 5): number[] {
    const pageNumbers = [];
    let startPage: number;
    let endPage: number;
    
    const currentDisplayPage = this.currentPage + 1;  // Convert to 1-based
  
    if (this.totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;
      
      if (currentDisplayPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentDisplayPage + maxPagesAfterCurrent >= this.totalPages) {
        startPage = this.totalPages - maxPagesToShow + 1;
        endPage = this.totalPages;
      } else {
        startPage = currentDisplayPage - maxPagesBeforeCurrent;
        endPage = currentDisplayPage + maxPagesAfterCurrent;
      }
    }
  
    // Add page numbers with ellipsis
    if (startPage > 1) pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push(-1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < this.totalPages - 1) pageNumbers.push(-1);
    if (endPage < this.totalPages) pageNumbers.push(this.totalPages);
  
    return pageNumbers;
  }

  private updateUrlParams(): void {
    const queryParams = this.computeSearchParams();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onSearch() {
    this.updateUrlParams();
    this.loadQuizzes();
  }

  onClearTitle() {
    this.searchOptions.title = '';
  }

  onSortDifficulty(direction: 'ASC' | 'DESC', event: Event) {
    event.preventDefault();
    this.searchOptions.sortByDifficulty = direction;
    delete this.searchOptions.sortByCreatedDate;
    this.loadQuizzes();
  }
  onSortCreated(direction: 'ASC' | 'DESC', event: Event) {
    event.preventDefault();
    this.searchOptions.sortByCreatedDate = direction;
    delete this.searchOptions.sortByDifficulty;
    this.loadQuizzes();
  }
  private getUniqueCourseCategories(): string[] {
    return [
'software-dev',
    'ai-data-science',
    'cybersecurity',
    'devops',
    'uiux-design',
    'database',
    'other-tech',
    ];
  }
}

