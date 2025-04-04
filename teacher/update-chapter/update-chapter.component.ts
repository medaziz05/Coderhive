import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterAttachment, ChapterDetails, ChapterRequest } from '@app/courses/models/chapter';
import { ChapterService } from '@app/courses/services/chapter.service';
@Component({
  selector: 'app-update-chapter',
  templateUrl: './update-chapter.component.html',
  styleUrls: ['./update-chapter.component.scss']
})
export class UpdateChapterComponent implements OnInit {
  courseId!: number;
  chapterId!: number;
  chapter: ChapterDetails | null = null; 
  chapterRequest: ChapterRequest = {
    chapterTitle: '',
    chapterDescription: '',
    chapterOrder: 0,
  };
  existingAttachments: ChapterAttachment[] = [];
  selectedFiles: File[] = [];
  loading = false;
  formSubmitted = false;
  public errorMessage: string = '';
  isLoading = true;

  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.chapterId = +params['chapterId'];
      this.loadChapterDetails();
    });
  }

  private loadChapterDetails(): void {
    this.chapterService.getChapterDetails(this.courseId, this.chapterId)
      .subscribe({
        next: (chapter) => {
          this.chapterRequest = {
            chapterTitle: chapter.chapterTitle,
            chapterDescription: chapter.chapterDescription,
            chapterOrder: chapter.chapterOrder
          };
          console.log('Attachments:', this.existingAttachments); 
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError('Failed to load chapter details');
          this.router.navigate([`/teacher/courses/${this.courseId}`]);
        }
      });
  }

  onSubmit(form: NgForm): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    // Check if no changes were made
    const isFormPristine = !form.dirty && this.selectedFiles.length === 0;
    if (isFormPristine) {
      this.router.navigate([`/teacher/courses/${this.courseId}/chapters/${this.chapterId}`]);
        return;
    }

    if (form.valid) {
        this.loading = true;

        const formData = new FormData();
        const chapterBlob = new Blob([JSON.stringify(this.chapterRequest)], {
            type: 'application/json'
        });

        formData.append('chapterRequest', chapterBlob);
        this.selectedFiles.forEach(file => {
            formData.append('files', file, encodeURIComponent(file.name));
        });

        this.chapterService.updateChapter(this.courseId, this.chapterId, formData)
            .subscribe({
                next: () => {
                    this.router.navigate([`/teacher/courses/${this.courseId}/chapters/${this.chapterId}`]);
                },
                error: (err) => {
                    this.loading = false;
                    this.handleError(
                        err.error?.message || 
                        'Failed to update chapter. Please check file sizes (max 10MB) and formats'
                    );
                }
            });
    }
}

  // Add this new method to show existing files
  getExistingAttachmentPreview(attachment: ChapterAttachment): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(attachment.previewUrl);
  }

  // Modified file selection handler
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      // Add validation similar to add component
      const maxFileSize = 10 * 1024 * 1024;
      const invalidFiles = this.selectedFiles.filter(f => f.size > maxFileSize);
      
      if (invalidFiles.length > 0) {
        this.handleError(`Some files exceed the 10MB limit: ${
          invalidFiles.map(f => `${f.name} (${this.formatFileSize(f.size)})`).join(', ')
        }`);
        this.selectedFiles = [];
        input.value = '';
      }
    }
  }

  // Reuse from add component
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
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
            Math.floor(Number(this.chapterRequest.chapterOrder))
        );
    }
}

}
