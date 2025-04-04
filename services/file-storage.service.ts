import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeUrl, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChapterAttachment } from '../models/chapter';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  private apiUrl = `${environment.apiBase}/api/files`; // Using environment for consistent URL management

  constructor(private http: HttpClient ,  private sanitizer: DomSanitizer ) { }

  // Upload file
  uploadFile(file: File): Observable<{ filePath: string }> {
    const formData = new FormData();
    formData.append('file', file, encodeURIComponent(file.name));

    return this.http.post<{ filePath: string }>(
      `${this.apiUrl}/attachments`,
      formData
    ).pipe(
      catchError(this.handleError)  // Handle errors consistently
    );
  }

  // Delete a file
  deleteFile(filePath: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/attachments/${encodeURIComponent(filePath)}`
    ).pipe(
      catchError(this.handleError)  // Handle errors consistently
    );
  }

  getSafePreview(attachment: ChapterAttachment): SafeResourceUrl {
    const url = `${attachment.previewUrl}?t=${new Date().getTime()}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  getPreviewUrl(filePath: string | undefined): string {
    if (!filePath) return '';
    return `${environment.apiBase}/api/files/attachments/preview/${filePath}`;
  }
  // Generic error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('File Service Error:', error);
    return throwError(() => new Error(
      error.error?.message || 'File operation failed'
    ));
  }
}
