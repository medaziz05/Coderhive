import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-list-user',
  templateUrl: './course-list-user.component.html',
  styleUrls: ['./course-list-user.component.scss']
})
export class CourseListUserComponent implements OnInit {
  courses: any[] = []; 

  constructor(private courseService: CourseService, private sanitizer: DomSanitizer) { }

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
}
