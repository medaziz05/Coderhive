import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-view-course-user',
  templateUrl: './view-course-user.component.html',
  styleUrls: ['./view-course-user.component.scss']
})
export class ViewCourseUserComponent implements OnInit {
    course: any; // Holds the course data
  
    constructor(private route: ActivatedRoute, private courseService: CourseService) {}
  
    ngOnInit(): void {
      this.loadCourseDetails();
    }
  
    loadCourseDetails(): void {
      const courseId = this.route.snapshot.paramMap.get('id'); // Get course ID from the URL
      if (courseId) {
        this.courseService.getCourseById(+courseId).subscribe(
          (data) => {
            this.course = data;
          },
          (error) => {
            console.error('Error fetching course details:', error);
          }
        );
      }
    }
  }
  

