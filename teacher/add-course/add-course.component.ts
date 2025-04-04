import { Component, OnInit } from '@angular/core';
import { CourseRequest, CourseLevel } from '../../models/course';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  courseRequest: CourseRequest = {
    courseTitle: '',
    courseCategory: '',
    courseDescription: '',
    coursePaid: false,
    level: CourseLevel.BEGINNER,
    courseImage: ''  // Store the Base64 encoded image here
  };
  categories = [
    'software-dev',
    'ai-data-science', 
    'cybersecurity',
    'devops',
    'uiux-design',
    'database',
    'other-tech'
  ];

  courseLevels = Object.values(CourseLevel);
  selectedFile: File | null = null;
  previewUrl: SafeUrl | string = 'assets/images/shape/select-thumb.webp';
  loading = false;
  formSubmitted = false;
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);

        // Convert the file to Base64
        this.convertFileToBase64(file);
      };
      reader.readAsDataURL(file);
    }
  }

  convertFileToBase64(file: File): void {
    // Just read the file for preview without converting to Base64
    const reader = new FileReader();
    reader.onload = () => {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
}


onSubmit(form: NgForm): void {
  this.formSubmitted = true;
  this.errorMessage = null;

  if (form.valid) {
      this.loading = true;

      // Create FormData object to send both text data and the file
      const formData = new FormData();
      
      // Append the courseRequest data (no Base64 conversion)
      formData.append('courseRequest', new Blob([JSON.stringify(this.courseRequest)], { type: 'application/json' }));

      // Append the selected image file (if any) to FormData
      if (this.selectedFile) {
          formData.append('file', this.selectedFile, this.selectedFile.name);
      }

      // Call the createCourse service to send the data to the backend
      this.courseService.createCourse(formData).subscribe({
          next: (createdCourse) => {
              // After successful course creation, navigate to the course details page
              this.router.navigate(['/teacher/courses', createdCourse.courseId]);
          },
          error: (err) => {
              // Handle error during the course creation
              this.loading = false;
              this.errorMessage = err.error?.message || 'Failed to create course';
              console.error('Course creation error:', err);
          }
      });
  } else {
      // If the form is invalid, mark all controls as touched
      Object.values(form.controls).forEach(control => {
          control.markAsTouched();
      });
  }
}

}
