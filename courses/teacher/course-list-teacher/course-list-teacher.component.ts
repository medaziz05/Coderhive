import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { CourseList } from '../../models/course';

@Component({
  selector: 'app-course-list-teacher',
  templateUrl: './course-list-teacher.component.html',
  styleUrls: ['./course-list-teacher.component.scss'],
})
export class CourseListTeacherComponent implements OnInit {
  courses: CourseList[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: data => {
        this.courses = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading courses:', err);
        this.errorMessage = 'Failed to load courses';
        this.loading = false;
      },
    });
  }

  deleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.courseId !== courseId);
        },
        error: err => {
          console.error('Error deleting course:', err);
        },
      });
    }
  }

  viewCourseDetails(courseId: number): void {
    this.router.navigate(['/teacher/courses', courseId]);
  }
}
