import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list-teacher.component.html',
  styleUrls: ['./course-list-teacher.component.scss']
})
export class CourseListComponent implements OnInit {
  courses: any[] = []; 

  constructor(
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (data) => {
        this.courses = data.map(course => {
          return {
            ...course,
            courseImage: this.sanitizeUrl(course.courseImage)
          };
        });
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  sanitizeUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  // Define the deleteCourse method here
  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe(
      () => {
        // Remove the course from the list after deletion
        this.courses = this.courses.filter(course => course.courseId !== courseId);
        console.log('Course deleted successfully');
      },
      (error) => {
        console.error('Error deleting course:', error);
      }
    );
  }
}
