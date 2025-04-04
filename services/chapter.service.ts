
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';  // Assuming you have environment settings for the API base URL
import { Chapter, ChapterDetails } from '../models/chapter';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private baseUrl = `${environment.apiBase}/api/courses`; // Using environment for consistent URL management

  constructor(private http: HttpClient) {}

  // Create Chapter with Files
  createChapter(courseId: number, formData: FormData): Observable<Chapter> {
    return this.http.post<Chapter>(
      `${this.baseUrl}/${courseId}/chapters`,
      formData
    ).pipe(
      catchError(this.handleError)  // Catch and handle any errors
    );
  }
  
  // Update Chapter with Files
  updateChapter(courseId: number, chapterId: number, formData: FormData): Observable<Chapter> {
    return this.http.put<Chapter>(
      `${this.baseUrl}/${courseId}/chapters/${chapterId}`,
      formData
    ).pipe(
      catchError(this.handleError)  // Catch and handle any errors
    );
  }

  // Delete a chapter
  deleteChapter(courseId: number, chapterId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${courseId}/chapters/${chapterId}`).pipe(
      catchError(this.handleError)  // Catch and handle any errors
    );
  }

// Get details of a chapter (with attachments)
getChapterDetails(courseId: number, chapterId: number): Observable<ChapterDetails> {
    return this.http.get<ChapterDetails>(`${this.baseUrl}/${courseId}/chapters/${chapterId}`).pipe(
      catchError(this.handleError)
    );
  }
  deleteAttachment(courseId: number, chapterId: number, filePath: string): Observable<void> {
    // Use single encoding
    const encodedFilePath = encodeURIComponent(filePath);
    const url = `${this.baseUrl}/${courseId}/chapters/${chapterId}/attachments/${encodedFilePath}`;
    
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error(
      error.error?.message || 'An unexpected error occurred'
    ));
  }


  
}

