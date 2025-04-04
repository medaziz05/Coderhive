import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { CourseList } from '../../models/course';

@Component({
  selector: 'app-course-list-student',
  templateUrl: './course-list-student.component.html',
  styleUrls: ['./course-list-student.component.scss']
})
export class CourseListStudentComponent {

      courses: CourseList[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router
  ) { }
 ngOnInit(): void { 
    this.loadCourses();
  }
  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.errorMessage = 'Failed to load courses';
        this.loading = false;
      }
    });
  }   handleImageError(event: Event): void { 
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default-course.jpg';
  }

  viewCourseDetails(courseId: number): void {
    this.router.navigate(['/teacher/courses', courseId]);
  }
}