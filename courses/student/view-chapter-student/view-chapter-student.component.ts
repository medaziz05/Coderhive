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
import { CourseDetails } from '../../models/course';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QuizService } from '@app/courses/services/quiz.service';
import { ChapterDetails } from '@app/courses/models/chapter';
@Component({
  selector: 'app-view-chapter-student',
  templateUrl: './view-chapter-student.component.html',
  styleUrls: ['./view-chapter-student.component.scss'],
})
export class ViewChapterStudentComponent implements OnInit {
  courseId!: number;
  chapterId!: number;
  chapter: ChapterDetails | null = null;
  course: CourseDetails | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  attachmentPreviews: { [key: string]: SafeResourceUrl } = {};
  showPreview = false;
  loadingPreview = false;

  constructor(
    private route: ActivatedRoute,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.chapterId = +params['chapterId'];
      this.loadChapter();
      this.loadCourse();
    });
  }

  private loadChapter(): void {
    this.isLoading = true;
    this.chapterService.getChapterDetails(this.courseId, this.chapterId).subscribe({
      next: async (data: ChapterDetails) => {
        this.chapter = data;
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
        if (attachment.previewUrl) {
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

  playQuiz(): void {
    // Navigating to the quiz component for the chapter
    this.router.navigate(['/student/courses', this.courseId, 'chapters', this.chapterId, 'quiz']);
  }

  toggleAttachmentPreview(attachment: any): void {
    this.loadingPreview = true;
    this.showPreview = false;
    setTimeout(() => {
      this.showPreview = true;
      this.loadingPreview = false;
      this.cd.detectChanges();
    }, 100);
  }
}