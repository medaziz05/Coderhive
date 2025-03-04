import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private baseUrl = 'http://localhost:8222/api/v1/forums';

  constructor(private http: HttpClient) {}

  // Toggle like for a post
  toggleLike(postId: number, userId: number): Observable<string> {
    const params = new HttpParams().set('postId', postId).set('userId', userId);
    return this.http.post<string>(
      `${this.baseUrl}/post/toggle`,
      {},
      { params, responseType: 'text' as 'json' }
    );
  }

  // Get like count for a post
  getLikeCount(postId: number): Observable<number> {
    const params = new HttpParams().set('postId', postId);
    return this.http.get<number>(`${this.baseUrl}/post/count`, { params });
  }

  // Check if the user has liked the post
  hasUserLikedPost(postId: number, userId: number): Observable<boolean> {
    const params = new HttpParams().set('postId', postId).set('userId', userId);
    return this.http.get<boolean>(`${this.baseUrl}/post/status`, { params });
  }
}
