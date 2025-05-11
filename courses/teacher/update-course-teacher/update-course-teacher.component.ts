import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CourseDetails, CourseLevel, CourseRequest } from '../../models/course';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-update-course-teacher',
  templateUrl: './update-course-teacher.component.html',
  styleUrls: ['./update-course-teacher.component.scss'],
})
export class UpdateCourseTeacherComponent implements OnInit {
  courseId!: number;
  courseRequest: CourseRequest = {
    courseTitle: '',
    courseCategory: '',
    courseDescription: '',
    coursePaid: false,
    level: CourseLevel.BEGINNER, // Ensure this is set as an enum
    courseImage: '',
  };
  selectedFile: File | null = null; // Declare the selectedFile property
  courseLevels: CourseLevel[] = Object.values(CourseLevel); // Ensure this is an array of enums
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.loadCourseData(this.courseId);
    });
  }

  loadCourseData(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: course => {
        this.courseRequest = {
          courseTitle: course.courseTitle,
          courseCategory: course.courseCategory,
          courseDescription: course.courseDescription,
          coursePaid: course.coursePaid,
          level: CourseLevel[course.level as keyof typeof CourseLevel], // Ensure level is correctly mapped
          courseImage: course.courseImage,
        };
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading course:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load course data. Please try again later.';
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = new FormData();

      // Append course details to FormData individually
      formData.append('courseTitle', this.courseRequest.courseTitle);
      formData.append('courseCategory', this.courseRequest.courseCategory);
      formData.append('courseDescription', this.courseRequest.courseDescription);
      formData.append('coursePaid', String(this.courseRequest.coursePaid));
      formData.append('level', this.courseRequest.level);

      // If a new image is selected, append it to FormData
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }

      // Call the updateCourse service
      this.courseService
        .updateCourse(this.courseId, this.courseRequest, this.selectedFile)
        .subscribe({
          next: updatedCourse => {
            this.router.navigate(['/teacher/courses', this.courseId]); // Navigate to the updated course details page
          },
          error: err => {
            console.error('Error updating course:', err);
            this.errorMessage = 'Failed to update course. Please try again later.';
          },
        });
    } else {
      this.errorMessage = 'Please ensure all fields are filled correctly.';
    }
  }

  // File handling and sanitization
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.courseRequest.courseImage = reader.result as string; // This line is used for preview
      };
      reader.readAsDataURL(file); // This ensures the file is read as Base64 for preview
    }
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url); // Sanitize URL for image preview
  }

  onCancel(): void {
    this.router.navigate(['/teacher/courses', this.courseId]); // Navigate back to course details if cancel
  }
}
