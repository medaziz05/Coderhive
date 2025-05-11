import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ChapterService } from '../../services/chapter.service'; // Import ChapterService
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CourseDetails, CourseLevel } from '../../models/course';
import { ChapterListDTO } from '../../models/chapter'; // Make sure the ChapterListDTO is imported
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse for error handling

@Component({
  selector: 'app-course-view-teacher',
  templateUrl: './course-view-teacher.component.html',
  styleUrls: ['./course-view-teacher.component.scss'],
})
export class CourseViewTeacherComponent implements OnInit {
  course: CourseDetails | null = null;
  courseId!: number;
  errorMessage: string | null = null;
  courseLevels = Object.values(CourseLevel);
  loading = true;
  chapters: ChapterListDTO[] = []; // List to hold the chapters
  selectedFile: File | null = null;
  currentTeacherId: number = 1;
  isCourseOwner: boolean = false;
   currentRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private chapterService: ChapterService, // Inject ChapterService
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // Match route parameter name
      if (this.courseId > 0) {
        this.getCourseDetails(this.courseId);
        this.getChaptersForCourse(this.courseId); // Fetch chapters when course is loaded
      } else {
        this.errorMessage = 'Invalid course ID';
        this.router.navigate(['/teacher/courses']);
      }
    });
  }

getCourseDetails(id: number): void {
  this.loading = true;
  this.courseService.getCourseById(id).subscribe({
    next: (data: CourseDetails) => {
      this.course = data;

      this.isCourseOwner = this.course.teacher.teacherId === this.currentTeacherId;

      // Vérification des dates
      if (this.course.courseCreatedAt) {
        this.course.courseCreatedAt = this.parseDate(this.course.courseCreatedAt);
      }
      if (this.course.courseUpdatedAt) {
        this.course.courseUpdatedAt = this.parseDate(this.course.courseUpdatedAt);
      }

      // Conversion de niveau si nécessaire
      if (this.course.level) {
        this.course.level = CourseLevel[this.course.level as keyof typeof CourseLevel];
      }

      // Rien à ajouter ici pour avgRating ou ratingCount : ils sont déjà dans l’objet CourseDetails reçu

      this.loading = false;
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error fetching course:', err);
      this.errorMessage = 'Course not found. Please check the URL.';
      this.loading = false;
    },
  });
}

  // Fetch chapters for the course
  getChaptersForCourse(courseId: number): void {
    this.courseService.getChaptersByCourse(courseId).subscribe({
      next: (chapters: ChapterListDTO[]) => {
        this.chapters = chapters; // Store the chapters in the array
      },
      error: (err: HttpErrorResponse) => {
        // Explicitly typing err as HttpErrorResponse
        console.error('Error fetching chapters:', err);
        this.errorMessage = 'Failed to load chapters. Please try again later.';
      },
    });
  }

  parseDate(date: string | Date | number[]): Date | null {
    // Handle array format (backend serialization issue)
    if (Array.isArray(date)) {
      // Accept arrays with 6 or 7 elements (ignore nanoseconds)
      if (date.length >= 6) {
        const [year, month, day, hour, minute, second] = date;
        try {
          // JavaScript months are 0-based (0 = January)
          return new Date(year, month - 1, day, hour, minute, second);
        } catch (e) {
          console.warn('Invalid date array format:', date);
          return null;
        }
      }
      console.warn('Unexpected array format for date:', date);
      return null;
    }
  
    // Handle string format
    try {
      // Remove milliseconds if present to prevent parsing issues
      const isoString = date.toString().split('.')[0] + 'Z';
      const parsedDate = new Date(isoString);
      
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      return parsedDate;
    } catch (e) {
      console.warn('Invalid date format:', date);
      return null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.course!.courseImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onSubmit(): void {
    // Check if course data is loaded properly
    if (!this.course) {
      this.errorMessage = 'Course data not loaded';
      return;
    }

    // Ensure that the level is correctly mapped to the CourseLevel enum
    const courseLevel: CourseLevel = CourseLevel[this.course.level as keyof typeof CourseLevel];

    // Create the courseRequest object with the updated details
    const courseRequest = {
      courseTitle: this.course.courseTitle ?? '',
      courseCategory: this.course.courseCategory ?? '',
      courseDescription: this.course.courseDescription ?? '',
      coursePaid: this.course.coursePaid,
      level: courseLevel,
      courseImage: this.course.courseImage ?? '',
    };

    // Ensure that 'selectedFile' is passed properly (it can be null if no file is selected)
    const selectedFile: File | null = this.selectedFile;

    // Call the updateCourse service with courseId, courseRequest, and selectedFile (if any)
    this.courseService.updateCourse(this.course.courseId, courseRequest, selectedFile).subscribe({
      next: () => {
        // Null check for this.course before accessing courseId
        if (this.course) {
          this.router.navigate(['/teacher/courses', this.course.courseId]); // Navigate to the updated course details page
        } else {
          this.errorMessage = 'Course data is not available for navigation';
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating course:', err);
        this.errorMessage = 'Failed to update course';
      },
    });
  }

  onDeleteChapter(chapterId: number): void {
    if (confirm('Are you sure you want to delete this chapter?')) {
      if (chapterId) {
        this.chapterService.deleteChapter(this.courseId, chapterId).subscribe({
          next: () => {
            this.course!.chapters = this.course!.chapters.filter(
              chapter => chapter.chapterId !== chapterId,
            );
          },
          error: err => {
            console.error('Error deleting chapter:', err);
            this.errorMessage = 'Failed to delete chapter';
          },
        });
      } else {
        console.error('Invalid chapterId');
        this.errorMessage = 'Chapter ID is invalid';
      }
    }
  }
}
