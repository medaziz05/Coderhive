import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from '../../services/chapter.service';
import { CourseService } from '../../services/course.service';
import { AttachmentDTO, ChapterDetails, ChapterListDTO } from '../../models/chapter';
import { CourseDetails } from '../../models/course';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { QuizService } from '@app/courses/services/quiz.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-chapter-teacher',
  templateUrl: './view-chapter-teacher.component.html',
  styleUrls: ['./view-chapter-teacher.component.scss'],
})
export class ViewChapterTeacherComponent implements OnInit {
  @ViewChild('previewContainer') previewContainer!: ElementRef;
  courseId!: number;
  chapterId!: number;
  quizId!: number;
  quiz: any;
  chapter: ChapterDetails | null = null;
  course: CourseDetails | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  selectedAttachment: any = null;
  showPreview = false;
  loadingPreview = false;
  Loading = true;
  courseTitle: string = 'Loading Course...';
  courseImage: string = 'assets/images/default-course.jpg';
  chapters: ChapterListDTO[] = [];
  attachmentPreviews: { [key: string]: SafeResourceUrl } = {};
  showClock: boolean = false; 
  deleting = false;


  constructor(
    private route: ActivatedRoute,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
    private quizService: QuizService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.chapterId = +params['chapterId'];
      this.loadChapter();
      this.loadCourse();
      this.loadCourseData();
    });
  }
  // Update the loadCourseData method
  private loadCourseData() {
    this.route.params
      .pipe(
        switchMap(params => {
          this.courseId = +params['courseId'];
          return forkJoin([
            this.courseService.getCourseById(this.courseId),
            this.courseService.getChaptersByCourse(this.courseId),
          ]);
        }),
      )
      .subscribe({
        next: ([course, chapters]) => {
          this.courseTitle = course.courseTitle;
          this.courseImage = course.courseImage || this.courseImage;
          this.chapters = chapters.sort((a, b) => a.chapterOrder - b.chapterOrder);
        },
        error: err => {
          console.error('Error loading data:', err);
          // Handle error appropriately
        },
      });
  }




  private loadChapter(): void {
    this.isLoading = true;
    this.chapterService.getChapterDetails(this.courseId, this.chapterId).subscribe({
      next: async (data: ChapterDetails) => {
        this.chapter = data;
        console.log('Chapter Details:', this.chapter); // Check if attachments are here
        console.log('Attachments:', this.chapter?.attachments); // Log the attachments
        await this.processAttachments();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: err => {
        console.error('Error fetching chapter:', err);
        this.handleError('Failed to load chapter details');
      },
    });
  }

  private loadCourse(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data: CourseDetails) => {
        this.course = data;
        this.cd.detectChanges();
      },
      error: err => {
        console.error('Error fetching course:', err);
        this.errorMessage = 'Failed to load course details.';
        this.cd.detectChanges();
      },
    });
  }

  private processAttachments(): void {
    if (this.chapter?.attachments) {
      this.chapter.attachments.forEach(attachment => {
        // Convert array-based date to JavaScript Date
        if (Array.isArray(attachment.uploadedAt)) {
          try {
            const dateParts = [...attachment.uploadedAt];
            const [year, month, day, hour = 0, minute = 0, second = 0, nanosecond = 0] = dateParts;
            attachment.uploadedAt = new Date(
              year,
              month - 1, // Months are 0-based in JS
              day,
              hour,
              minute,
              second,
              Math.floor(nanosecond / 1000000), // Convert nanoseconds to milliseconds
            );
          } catch (e) {
            console.error('Invalid date conversion:', e);
            attachment.uploadedAt = null;
          }
        }
        // Create preview URL for supported types
        if (attachment.previewUrl && this.isPreviewSupported(attachment.fileType)) {
          this.attachmentPreviews[attachment.fileName] =
            this.sanitizer.bypassSecurityTrustResourceUrl(attachment.previewUrl);
        }
      });
    }
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.cd.detectChanges();
  }

  closePreview() {
    this.selectedAttachment = null;
    this.showPreview = false;
  }
  private generatePreviewUrl(attachment: any): string {
    return attachment.previewUrl;
  }

  onIframeLoad(): void {
    const iframe = document.querySelector('.embedded-preview') as HTMLElement;
    if (iframe) {
      iframe.classList.add('loaded');
    }
    this.loadingPreview = false;
    this.cd.detectChanges();
  }
  onIframeError(): void {
    this.loadingPreview = false;
    this.errorMessage = 'Failed to load preview.';
    this.cd.detectChanges();
  }

  getSafePreview(attachment: any): SafeResourceUrl {
    // Add random query parameter to bypass cache
    const cacheBuster = `t=${Date.now()}`;
    const url = `${attachment.previewUrl}?${cacheBuster}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public isPreviewSupported(fileType: string): boolean {
    const supportedTypes = new Set([
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    return (
      fileType === 'application/pdf' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  }

  toggleAttachmentPreview(attachment: AttachmentDTO) {
    this.loadingPreview = true;
    this.selectedAttachment = null;
  
    setTimeout(() => {
      // Allow UI to update loading state
      this.selectedAttachment = {
        fileName: attachment.fileName,
        previewUrl: attachment.previewUrl,
        fileType: attachment.fileType,
      };
      this.showPreview = true;
      this.loadingPreview = false;
  
      // Start the clock when the attachment is opened
      this.startClock();
      this.showClock = true;  // Show the clock when attachment is selected
  
      this.cd.detectChanges();
    }, 100);
  }
  toggleClockVisibility() {
    const clockElement = document.getElementById('attachment-clock');
    
    if (clockElement) {
      clockElement.style.display = 'block'; // Make the clock visible
      this.startClock(); // Start the timer
    }
  }

  startClock(): void {
    const clockElement = document.getElementById('attachment-clock')!;
    
    // Reset time to 00:00:00 every time the clock starts
    const hoursElement = document.getElementById('hours')!;
    const minutesElement = document.getElementById('min')!;
    const secondsElement = document.getElementById('sec')!;
    
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
  
    // Make the clock visible
    clockElement.style.display = 'block';  // Show the clock
  
    // Function to update the clock
    function updateClock() {
      seconds++;
      
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
  
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
  
      // Format time to ensure two digits for hours, minutes, and seconds
      hoursElement.textContent = (hours < 10 ? '0' : '') + hours;
      minutesElement.textContent = (minutes < 10 ? '0' : '') + minutes;
      secondsElement.textContent = (seconds < 10 ? '0' : '') + seconds;
    }
  
    // Update the clock every second (1000ms)
    setInterval(updateClock, 1000);
  }
  
  deleteAttachment(filePath: string | undefined): void {
    if (!filePath) {
      console.error('Trying to delete attachment without filePath');
      return;
    }
  
    console.log('Deleting attachment with path:', filePath);
  
    if (confirm('Are you sure you want to delete this attachment?')) {
      this.chapterService.deleteAttachment(this.courseId, this.chapterId, filePath).subscribe({
        next: () => {
          if (this.chapter) {
            // ✅ Corrected filter logic: removes the deleted attachment
            this.chapter.attachments = [
              ...this.chapter.attachments.filter(att => att.filePath !== filePath),
            ];
  
            // If there are no attachments left, hide the clock
            if (this.chapter.attachments.length === 0) {
              this.hideClock();
            }
          }
          this.cd.detectChanges(); // Ensures UI updates
          console.log('Attachment successfully deleted:', filePath);
        },
        error: err => {
          console.error('Deletion failed:', err);
          this.handleError('Failed to delete attachment');
        },
      });
    }
  }

  hideClock(): void {
    const clockElement = document.getElementById('attachment-clock');
    if (clockElement) {
      clockElement.style.display = 'none'; // Hide the clock
    }
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

// view-chapter-teacher.component.ts
// view-chapter-teacher.component.ts
deleteQuiz(): void {
  if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
    this.deleting = true;
    this.quizService.deleteChapterQuiz(this.courseId, this.chapterId).subscribe({
      next: () => {
        if (this.chapter) {
          this.chapter.quiz = undefined;
          this.toastr.success('Quiz deleted successfully');
        }
        this.deleting = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Quiz deletion failed:', err);
        this.toastr.error('Failed to delete quiz. Please try again.');
        this.deleting = false;
        this.cd.detectChanges();
      }
    });
  }
}


}


