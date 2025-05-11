import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ChapterService } from '../../services/chapter.service'; // Import ChapterService
import { CourseDetails, CourseLevel } from '../../models/course';
import { ChapterDetails, ChapterListDTO } from '../../models/chapter'; // Make sure the ChapterListDTO is imported
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse for error handling

@Component({
  selector: 'app-course-view-student',
  templateUrl: './course-view-student.component.html',
  styleUrls: ['./course-view-student.component.scss'],
})
export class CourseViewStudentComponent implements OnInit {
  course: CourseDetails | null = null;
  courseId!: number;
  errorMessage: string | null = null;
  courseLevels = Object.values(CourseLevel);
  loading = true;
  chapters: ChapterListDTO[] = [];
  currentStudentId: number = 2;
  hasMembership: boolean = false;
    currentRating: number = 0; // To store the current rating
  studentHasRated: boolean = false;  // To check if the student has already rated
  hoveredRating: number = 0; // To store the hovered rating for the UI effect

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private chapterService: ChapterService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // Match route parameter name
      if (this.courseId > 0) {
        this.getCourseDetails(this.courseId);
        this.getChaptersForCourse(this.courseId); // Fetch chapters when course is loaded
        this.checkMembershipStatus();
      } else {
        this.errorMessage = 'Invalid course ID';
        this.router.navigate(['/student/courses']);
      }
    });
  }

  private checkMembershipStatus(): void {
    this.chapterService.checkStudentMembership(this.courseId, this.currentStudentId)
      .subscribe({
        next: (hasMembership) => this.hasMembership = hasMembership,
        error: (err) => {
          console.error('Membership check failed:', err);
          this.hasMembership = false;
        }
      });
  }

  getCourseDetails(id: number): void {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (data: CourseDetails) => {
        this.course = data;

        // Check if student has already rated the course
        if (this.course?.ratingCount > 0) {
          this.studentHasRated = true; // Mark as rated
          this.currentRating = this.course?.avgRating || 0;  // Set the rating to the current rating
        } else {
          this.currentRating = 0; // Initialize the rating to 0 if no ratings exist yet
        }

        // Date parsing and level conversion
        if (this.course.courseCreatedAt) {
          this.course.courseCreatedAt = this.parseDate(this.course.courseCreatedAt);
        }
        if (this.course.courseUpdatedAt) {
          this.course.courseUpdatedAt = this.parseDate(this.course.courseUpdatedAt);
        }

        if (this.course.level) {
          this.course.level = CourseLevel[this.course.level as keyof typeof CourseLevel];
        }

        // Fetch chapters for the course (if necessary)
        this.getChaptersForCourse(id);

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching course:', err);
        this.errorMessage = 'Course not found. Please check the URL.';
        this.loading = false;
      },
    });
  }

  hoverStar(star: number): void {
    if (!this.studentHasRated) {
      this.hoveredRating = star; // Update the hovered rating while hovering
    }
  }

  // Allow users to select a rating
  rateCourse(star: number): void {
    if (!this.studentHasRated) { // Prevent rating if already rated
      this.currentRating = star; // Set current rating
    }
  }

  submitRating(): void {
    if (this.currentRating > 0 && !this.studentHasRated) {
      this.courseService.submitCourseRating(this.courseId, this.currentStudentId, this.currentRating).subscribe({
        next: () => {
          console.log('Course rated successfully');
          this.course!.avgRating = this.currentRating;  // Update the average rating immediately
          this.course!.ratingCount++;  // Increment the rating count
          this.studentHasRated = true; // Mark the course as rated
        },
        error: (err) => {
          console.error('Error rating course:', err);
        }
      });
    } else {
      console.warn('You must select a rating');
    }
  }



  getChaptersForCourse(courseId: number): void {
    this.courseService.getChaptersByCourse(courseId).subscribe({
      next: (chapters: ChapterListDTO[]) => {
        this.chapters = chapters;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching chapters:', err);
        this.errorMessage = 'Failed to load chapters. Please try again later.';
      },
    });
  }
  parseDate(date: string | Date | number[]): Date | null {
    if (Array.isArray(date)) {
      // Assuming the array is [year, month, day, hour, minute, second, millisecond]
      if (date.length === 7) {
        const [year, month, day, hour, minute, second, millisecond] = date;
        const parsedDate = new Date(year, month - 1, day, hour, minute, second, millisecond); // month - 1 because months start at 0
        if (isNaN(parsedDate.getTime())) {
          console.warn('Invalid date format received:', date);
          return null;
        }
        return parsedDate;
      } else {
        console.warn('Invalid array format received:', date);
        return null;
      }
    }
    // Fallback to handling string or Date if it's not an array
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.warn('Invalid date format received:', date);
      return null;
    }
    return parsedDate;
  }

}
