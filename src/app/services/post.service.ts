import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PageResponse, Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = 'http://localhost:8222/api/v1/forums';

  constructor(private http: HttpClient) {}

  getAllPosts(
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<Post>> {
    return this.http.get<PageResponse<any>>(
      `${this.baseUrl}/posts?page=${page}&size=${size}`
    );
  }

  createPost(
    post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'comments' | 'likes'>
  ): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/post`, post).pipe(
      map((post) => ({
        ...post,
        created_at: new Date(post.created_at),
        updated_at: new Date(post.updated_at),
      }))
    );
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/post/${id}`);
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/post/${id}`, post).pipe(
      map((post) => ({
        ...post,
        created_at: new Date(post.created_at),
        updated_at: new Date(post.updated_at),
      }))
    );
  }

  deletePost(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/post/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  // Helper methods for post statistics
  getPostCommentsCount(post: Post): number {
    return post.comments?.length || 0;
  }

  getPostLikesCount(post: Post): number {
    return post.likes?.length || 0;
  }

  hasUserLikedPost(post: Post, userId: number): boolean {
    return post.likes?.some((like) => like.userId === userId) || false;
  }
}
