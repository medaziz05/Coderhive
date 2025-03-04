import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/post';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:8222/api/v1/forums';

  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/comment/post/${postId}`);
  }

  createComment(
    postId: number,
    userId: number,
    comment: any
  ): Observable<Comment> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Comment>(
      `${this.baseUrl}/comment/post/${postId}/${userId}`,
      comment,
      { headers }
    );
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/comment/${id}`);
  }

  updateComment(id: number, comment: Partial<Comment>): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/comment/${id}`, comment);
  }

  deleteComment(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/comment/${id}`, {
      responseType: 'text' as 'json',
    });
  }
}
