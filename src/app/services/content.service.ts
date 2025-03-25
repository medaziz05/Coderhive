import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Content } from '../models/content';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private readonly apiUrl = `http://localhost:8222/api/v1/training/content`;

  constructor(private http: HttpClient) {}
  createContent(content: Content): Observable<Content> {
    return this.http.post<Content>(this.apiUrl, content);
  }
  

  getAllContents(): Observable<Content[]> {
    return this.http.get<Content[]>(this.apiUrl);
  }

  getContentById(id: number): Observable<Content> {
    return this.http.get<Content>(`${this.apiUrl}/${id}`);
  }

 

  updateContent(id: number, content: Content): Observable<Content> {
    return this.http.put<Content>(`${this.apiUrl}/${id}/${content.moduleId}`, content);
  }

  deleteContent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
