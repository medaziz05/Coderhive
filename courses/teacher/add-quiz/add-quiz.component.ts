import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Difficulty, Quiz, QuizCreationRequest  } from '@app/courses/models/quiz.model';
import { CourseService } from '@app/courses/services/course.service';
import { QuizService } from '@app/courses/services/quiz.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit {
  loading = false;
  formSubmitted = false;
  success = false;
  errorMessage = '';
  error = false;
  courseId!: number;
  chapterId!: number;
  category: string = '';
  nquestions = [5, 10, 20, 30];
  difficulties = Object.values(Difficulty);
  
  quiz: QuizCreationRequest = {
    topic: '',
    difficulty: Difficulty.EASY,
    numberOfQuestions: 10
  };

  constructor(
    private quizService: QuizService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.chapterId = +params['chapterId'];
      this.loadCourseCategory();
    });
  }

  private loadCourseCategory(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.category = course.courseCategory;
      },
      error: (err) => {
        this.loading = false;
        let errorMsg = 'Quiz creation failed';
        
        if (err.error instanceof ErrorEvent) {
          // Client-side error
          errorMsg = `Error: ${err.error.message}`;
        } else {
          // Server-side error
          errorMsg = err.error?.detail || err.message || errorMsg;
        }
        
        this.toastr.error(errorMsg);
        console.error('Quiz creation error:', err);
      }
    });
  }


  onSubmit(form: NgForm) {
    this.formSubmitted = true;
    if (form.invalid) return;
    this.createQuiz();
  }

  private createQuiz(): void {
    this.loading = true;

    // Ensure that the quiz object contains the correct data before sending it
    console.log('Quiz data before sending:', this.quiz);  // Debugging line to check data structure

    this.quizService.createQuiz(this.courseId, this.chapterId, this.quiz).subscribe({
      next: (quiz) => {
        this.toastr.success('Quiz created successfully!');
        this.router.navigate([ '/teacher/courses', this.courseId, 'chapters', this.chapterId ]);
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || 'Failed to create quiz';
        this.toastr.error(errorMsg);
        console.error('Quiz creation error:', err);
      }
    });
}

  onTryAgain() {
    this.success = false;
    this.error = false;
    this.loading = false;
  }
}
