import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from '../../services/chapter.service';
import { ChapterRequest } from '../../models/chapter';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss'],
})
export class AddChapterComponent implements OnInit {
  courseId!: number;
  chapterRequest: ChapterRequest = {
    chapterTitle: '',
    chapterDescription: '',
    chapterOrder: 0,
  };
  selectedFiles: File[] = [];
  loading = false;
  formSubmitted = false;
  public errorMessage: string = ''; // Make it public

  constructor(
    private chapterService: ChapterService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = +params['courseId'];

      if (!isNaN(courseId)) {
        this.courseId = courseId;
      } else {
        this.handleError('Invalid course ID');
        this.router.navigate(['/teacher/courses']);
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const decimals = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      const maxFileSize = 10 * 1024 * 1024; // 10MB limit
      const totalSize = this.selectedFiles.reduce((sum, file) => sum + file.size, 0);

      // Check if any file exceeds the single file size limit
      const invalidFiles = this.selectedFiles.filter(f => f.size > maxFileSize);

      if (invalidFiles.length > 0) {
        this.handleError(
          `Some files exceed the 10MB limit: ${invalidFiles.map(f => `${f.name} (${this.formatFileSize(f.size)})`).join(', ')}`,
        );
        this.selectedFiles = [];
        input.value = '';
        return; // Stop further execution
      }

      // Check if the total size exceeds the limit
      if (totalSize > maxFileSize) {
        this.handleError(
          `The total file size exceeds the 10MB limit. Total size: ${this.formatFileSize(totalSize)}`,
        );
        this.selectedFiles = [];
        input.value = '';
      }
    }
  }

  onSubmit(form: NgForm): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (form.valid && this.courseId > 0) {
      this.loading = true;

      const formData = new FormData();
      const chapterBlob = new Blob([JSON.stringify(this.chapterRequest)], {
        type: 'application/json',
      });

      formData.append('chapterRequest', chapterBlob);

      // Append the selected files to the formData
      this.selectedFiles.forEach(file => {
        formData.append('files', file, encodeURIComponent(file.name));
      });

      this.chapterService.createChapter(this.courseId, formData).subscribe({
        next: createdChapter => {
          this.router.navigate([`/teacher/courses/${this.courseId}`]);
        },
        error: err => {
          this.loading = false;
          this.handleError(
            err.message ||
              err.error?.error ||
              'Failed to create chapter. Please check file sizes (max 10MB) and formats (PDF/DOC/DOCX/TXT)',
          );
        },
      });
    }
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 5000); // Clear the message after 5 seconds
  }

  validateNumberInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isDigit = /[0-9]/.test(event.key);

    if (!isDigit && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  validatePaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text/plain');
    if (pastedData && !/^\d+$/.test(pastedData)) {
      event.preventDefault();
    }
  }

  onInputChapterOrder() {
    // Ensure value stays as integer
    if (this.chapterRequest.chapterOrder) {
      this.chapterRequest.chapterOrder = Math.abs(
        Math.floor(Number(this.chapterRequest.chapterOrder)),
      );
    }
  }
}
