import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course, CourseLevel } from '../../../courses/models/course.model';

@Component({
  selector: 'app-course-update-teacher',
  templateUrl: './course-update-teacher.component.html',
  styleUrls: ['./course-update-teacher.component.scss']
})
export class CourseUpdateTeacherComponent implements OnInit {
  courseId!: number;
  course: Course = new Course();
  coursePaidValue: string = 'false'; // Toggle for course payment status

  // Define course levels as we did in the add-course component
  courseLevels = Object.values(CourseLevel);

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!; // Get course ID from route
    this.loadCourseData(); // Fetch course data based on ID
  }

  // Method to fetch the course data using the courseId
  loadCourseData(): void {
    this.courseService.getCourseById(this.courseId).subscribe(
      (data) => {
        this.course = data;
        this.coursePaidValue = this.course.coursePaid ? 'true' : 'false'; // Set the course paid value
      },
      (error) => {
        console.error('Error fetching course:', error);
      }
    );
  }

  // Handle form submission (update course)
  onSubmit(): void {
    this.course.coursePaid = this.coursePaidValue === 'true';
    
    // Manually set the price to 0 if the course is free
    if (this.course.coursePaid === false) {
      this.course.coursePrice = 0;
    }

    this.courseService.updateCourse(this.courseId, this.course).subscribe(
      (response) => {
        console.log('✅ Course updated successfully', response);
      },
      (error) => {
        console.error('❌ Error updating course:', error);
      }
    );
  }

  // Handle file selection for image upload
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      // Upload image and store the valid URL
      this.courseService.uploadImage(formData).subscribe(
        (response) => {
          this.course.courseImage = response.imageUrl;
          console.log("✅ Image uploaded successfully:", response.imageUrl);
        },
        (error) => {
          console.error("❌ Error uploading image:", error);
        }
      );
    }
  }

  // Toggle price visibility based on the "Paid" option
  togglePrice(): void {
    this.course.coursePaid = this.coursePaidValue === 'true';

    // If the course is free, manually set the price to 0
    if (!this.course.coursePaid) {
      this.course.coursePrice = 0;
    }
  }

  // Sanitize the URL to ensure it starts with "http"
  sanitizeUrl(url: string): string {
    return url.startsWith('http') ? url : 'http://localhost:8081' + url;
  }
}
