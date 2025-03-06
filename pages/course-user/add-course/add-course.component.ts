import { Component } from '@angular/core';
import { CourseService } from '../../../services/course.service'; 
import { Course, CourseLevel } from '../../../courses/models/course.model'; 

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  coursePaidValue: string = 'false';
  course: Course = new Course();

  courseLevels = Object.values(CourseLevel); 
  constructor(private courseService: CourseService) {}




  sanitizeUrl(url: string): string {
    return url.startsWith('http') ? url : 'http://localhost:8081' + url;
  }
  
  onSubmit(): void {
    this.course.coursePaid = this.coursePaidValue === 'true';
    this.course.level = this.course.level as CourseLevel;
    this.course.teacherId = 1; 
    this.course.courseId = null;
    if (this.course.coursePaid && (!this.course.coursePrice || this.course.coursePrice < 50)) {
        alert("❌ Paid courses must have a price of at least 50DT!");
        return; 
    }

    console.log("Submitting course:", this.course);
    console.log("Image Data Length:", this.course.courseImage?.length || 0);

    this.courseService.createCourse(this.course).subscribe(
        response => {
            console.log('✅ Course created:', response);
        },
        error => {
            console.error('❌ Error creating course:', error);
        }
    );
}

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
      const formData = new FormData();
      formData.append("file", file);
      // ✅ Upload image and store the valid URL
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



togglePrice(): void {
  this.course.coursePaid = this.coursePaidValue === 'true';

  if (!this.course.coursePaid) {
    this.course.coursePrice = 0; 
  }
}



}