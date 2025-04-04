import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ChapterService } from '../../services/chapter.service';  // Import ChapterService
import { CourseDetails, CourseLevel } from '../../models/course';
import { ChapterListDTO } from '../../models/chapter'; // Make sure the ChapterListDTO is imported
import { HttpErrorResponse } from '@angular/common/http';  // Import HttpErrorResponse for error handling

@Component({
  selector: 'app-course-view-student',
  templateUrl: './course-view-student.component.html',
  styleUrls: ['./course-view-student.component.scss']
})
export class CourseViewStudentComponent implements OnInit {
  course: CourseDetails | null = null;
  courseId!: number;
  errorMessage: string | null = null;
  courseLevels = Object.values(CourseLevel);
  loading = true;
  chapters: ChapterListDTO[] = [];  // List to hold the chapters

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private chapterService: ChapterService,  // Inject ChapterService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // Match route parameter name
      if (this.courseId > 0) {
        this.getCourseDetails(this.courseId);
        this.getChaptersForCourse(this.courseId);  // Fetch chapters when course is loaded
      } else {
        this.errorMessage = 'Invalid course ID';
        this.router.navigate(['/student/courses']);
      }
    });
  }

  getCourseDetails(id: number): void {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (data: CourseDetails) => {
        this.course = data;

        // Convert courseCreatedAt and courseUpdatedAt from string to Date object with validation
        if (this.course.courseCreatedAt) {
          this.course.courseCreatedAt = this.parseDate(this.course.courseCreatedAt);
        }
        if (this.course.courseUpdatedAt) {
          this.course.courseUpdatedAt = this.parseDate(this.course.courseUpdatedAt);
        }

        // Convert the level string to the CourseLevel enum value
        if (this.course.level) {
          this.course.level = CourseLevel[this.course.level as keyof typeof CourseLevel];
        }

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {  // Explicitly typing err as HttpErrorResponse
        console.error('Error fetching course:', err);
        this.errorMessage = 'Course not found. Please check the URL.';
        this.loading = false;
      }
    });
  }

  // Fetch chapters for the course
  getChaptersForCourse(courseId: number): void {
    this.courseService.getChaptersByCourse(courseId).subscribe({
      next: (chapters: ChapterListDTO[]) => {
        this.chapters = chapters;  // Store the chapters in the array
      },
      error: (err: HttpErrorResponse) => {  // Explicitly typing err as HttpErrorResponse
        console.error('Error fetching chapters:', err);
        this.errorMessage = 'Failed to load chapters. Please try again later.';
      }
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
