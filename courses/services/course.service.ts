import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CourseList, CourseDetails, CourseRequest, CourseLevel } from '../models/course';
import { Chapter, ChapterListDTO } from '../models/chapter';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8081/api/courses';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<CourseList[]> {
    return this.http.get<CourseList[]>(`${this.apiUrl}/list`); // Ensure correct route to list all courses
  }

  // Get course by ID
  getCourseById(id: number): Observable<CourseDetails> {
    return this.http.get<CourseDetails>(`${this.apiUrl}/${id}`);
  }

  // Create a new course
  createCourse(courseData: FormData): Observable<CourseDetails> {
    return this.http.post<CourseDetails>(`${this.apiUrl}/add`, courseData);
  }

  // Update course by ID
  updateCourse(
    id: number,
    courseRequest: CourseRequest,
    selectedFile: File | null,
  ): Observable<CourseDetails> {
    const formData = new FormData();
    formData.append(
      'courseRequest',
      new Blob([JSON.stringify(courseRequest)], { type: 'application/json' }),
    );
    if (selectedFile) {
      formData.append('file', selectedFile, selectedFile.name);
    }
    return this.http.put<CourseDetails>(`${this.apiUrl}/${id}`, formData);
  }

  // Delete course by ID
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Endpoint to delete course by ID
  }

  // Get all chapters for a course
  getChaptersByCourse(courseId: number): Observable<ChapterListDTO[]> {
    return this.http.get<ChapterListDTO[]>(`${this.apiUrl}/${courseId}/chapters`); // Updated endpoint for fetching chapters
  }

  // Submit a rating for a course
  submitCourseRating(courseId: number, studentId: number, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/rate`, {
      studentId: studentId,
      rating: rating,
    });
  }

    // Get the average rating for a course
  getCourseRating(courseId: number): Observable<{ avgRating: number, ratingCount: number }> {
    return this.http.get<{ avgRating: number, ratingCount: number }>(`${this.apiUrl}/${courseId}/rating`);
  }

    // Get filtered courses
  getFilteredCourses(filters: {
    searchQuery?: string;
    category?: string;
    price?: string;
    level?: string;
  }): Observable<CourseList[]> {
    console.log('Applying filters:', filters);
    
    let params = new HttpParams();
    
    if (filters.searchQuery) params = params.append('searchQuery', filters.searchQuery);
    if (filters.category) params = params.append('category', filters.category);
    if (filters.price && filters.price !== 'All') params = params.append('price', filters.price);
    if (filters.level && filters.level !== 'All Levels') params = params.append('level', filters.level);
  
    return this.http.get<CourseList[]>(`${this.apiUrl}/filter`, { params }).pipe(
      tap(courses => console.log('Received filtered courses:', courses))
    );
  }
}

