import { Component, OnInit } from '@angular/core';
import { CourseRequest, CourseLevel } from '../../models/course';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent {
  courseRequest: CourseRequest = {
    courseTitle: '',
    courseCategory: '',
    courseDescription: '',
    coursePaid: false,
    level: CourseLevel.BEGINNER,
    courseImage: '', // Store the Base64 encoded image here
  };
  categories = [
    'software-dev',
    'ai-data-science',
    'cybersecurity',
    'devops',
    'uiux-design',
    'database',
    'other-tech',
  ];

  courseLevels = Object.values(CourseLevel);
  selectedFile: File | null = null;
  previewUrl: SafeUrl | string = '/assets/images/shape/select-thumb.webp';
  loading = false;
  formSubmitted = false;
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private sanitizer: DomSanitizer,
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
  
      const formData = new FormData();
      formData.append(
        'courseRequest',
        new Blob([JSON.stringify(this.courseRequest)], { type: 'application/json' }),
      );
  
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
  
      this.courseService.createCourse(formData).subscribe({
        next: createdCourse => {
          // Navigate to course list instead of details
          this.router.navigate(['/teacher/courses']);
        },
        error: err => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to create course';
          console.error('Course creation error:', err);
        },
      });
    } else {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
