import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../courses/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8081/api/courses';

  constructor(private http: HttpClient) { }

  
  uploadImage(formData: FormData): Observable<{ imageUrl: string }> {
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData);
  }
  
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/add-course`, course);
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/view-courses`);
  }

  getCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/get/${courseId}`);
  }

  updateCourse(courseId: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/update/${courseId}`, course);
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${courseId}`);
  }
}
