import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { CourseLevel, CourseList } from '../../models/course';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-course-list-student',
  templateUrl: './course-list-student.component.html',
  styleUrls: ['./course-list-student.component.scss'],
})
export class CourseListStudentComponent {
  courses: CourseList[] = [];
  filteredCourses: CourseList[] = [];
 loading: boolean = false;
  errorMessage: string | null = null;
  currentFilters = {
    searchQuery: '',
    category: '',
    price: 'All',
    level: 'All Levels'
  };

  searchQuery: string = '';
  selectedCategories: string[] = [];
  selectedPrice: string = 'All';
  selectedLevel: string = 'All Levels';

  categories = [
    'software-dev',
    'ai-data-science',
    'cybersecurity',
    'devops',
    'uiux-design',
    'database',
    'other-tech',
  ];
  
  priceOptions = ['All', 'Free', 'Paid'];
  levelOptions = [
    { display: 'All Levels', value: 'All Levels' },
    { display: 'Beginner', value: 'BEGINNER' },
    { display: 'Mid Level', value: 'MID_LVL' },
    { display: 'Advanced', value: 'ADVANCED' }
  ];
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  
  constructor(
    private courseService: CourseService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.loadCourses();
      this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());
  }


 loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: data => {
        this.courses = data;
        this.filteredCourses = [...this.courses];
        this.loading = false;
      },
      error: err => {
        console.error('Error loading courses:', err);
        this.errorMessage = 'Failed to load courses';
        this.loading = false;
      },
    });
  }

  // Search handling with debounce
  onSearchInput(): void {
    this.currentFilters.searchQuery = this.searchQuery;
    this.applyFilters();
  }
    // Search filter
    onSearchChange(query: string): void {
      this.currentFilters.searchQuery = query;
      this.applyFilters();
    }
    // Category filter
    onCategoryChange(category: string, isChecked: boolean): void {
      this.currentFilters.category = isChecked ? category : '';
      this.applyFilters();
    }
    
    // Price filter
    onPriceChange(price: string): void {
      this.currentFilters.price = price;
      this.applyFilters();
    }
    // Level filter
    onLevelChange(level: string): void {
      this.currentFilters.level = level;
      this.applyFilters();
    }
  
    applyFilters(): void {
      console.log('Applying filters with:', this.currentFilters);
      this.loading = true;
      
      this.courseService.getFilteredCourses({
        searchQuery: this.currentFilters.searchQuery,
        category: this.currentFilters.category,
        price: this.currentFilters.price,
        level: this.currentFilters.level
      }).subscribe({
        next: (courses) => {
          console.log('Filtered courses received:', courses);
          this.filteredCourses = courses;
          this.loading = false;
        },
        error: (err) => {
          console.error('Filter error:', err);
          this.errorMessage = 'Failed to apply filters';
          this.loading = false;
        }
      });
    }

    resetFilters(): void {
      this.searchQuery = '';
      this.selectedCategories = [];
      this.selectedPrice = 'All';
      this.selectedLevel = 'All Levels';
      this.applyFilters();
    }
  
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/default-course.jpg';
  }

  viewCourseDetails(courseId: number): void {
    this.router.navigate(['/student/courses', courseId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }
}
