import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchDTO } from '../models/search.model';
import { ScoreDTO, ScoreSubmissionDTO } from '../models/score.model';
import { Quiz, QuizCreationRequest, QuizDocument, QuizDTO, QuizScoreSubmission } from '../models/quiz.model';

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private coursesBaseUrl = `${environment.apiBase}/api/courses`;
  private quizBaseUrl = `${environment.apiBase}/api/quiz`;
  constructor(private http: HttpClient) {}

  createQuiz(courseId: number, chapterId: number, request: QuizCreationRequest): Observable<QuizDTO> {
    return this.http.post<QuizDTO>(
      `${this.coursesBaseUrl}/${courseId}/chapters/${chapterId}/quiz`,
      request
    );
  }

  

  getChapterQuiz(courseId: number, chapterId: number): Observable<QuizDTO> {
    return this.http.get<QuizDTO>(
      `${this.coursesBaseUrl}/${courseId}/chapters/${chapterId}/quiz`
    );
  }


  deleteChapterQuiz(courseId: number, chapterId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.coursesBaseUrl}/${courseId}/chapters/${chapterId}/quiz`
    );
  }


 // Get quiz details
 getQuiz(quizId: number): Observable<QuizDTO> {
  return this.http.get<QuizDTO>(`${this.quizBaseUrl}/${quizId}`);
}


getQuizImage(quizId: number): Observable<Blob> {
  return this.http.get(`${this.quizBaseUrl}/${quizId}/photo`, {
    responseType: 'blob'
  });
}
getQuizScores(quizId: number): Observable<ScoreDTO[]> {
  return this.http.get<ScoreDTO[]>(`${this.quizBaseUrl}/${quizId}/score`);
}

submitScore(score: QuizScoreSubmission): Observable<ScoreDTO> {
  return this.http.post<ScoreDTO>(`${this.quizBaseUrl}/score`, score);
}
search(searchParams: SearchDTO): Observable<Page<QuizDocument>> {
  let params = new HttpParams();
  // Convert SearchDTO to query parameters
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params = params.append(key, value.toString());
    }
  });

  return this.http.get<Page<QuizDocument>>(`${this.quizBaseUrl}`, { params });
}

private createSearchParams(params: SearchDTO): HttpParams {
  let httpParams = new HttpParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      httpParams = httpParams.append(key, value.toString());
    }
  });
  return httpParams;
}


getQuizImageUrl(photoPath: string): string {
  return `${environment.apiBase}/uploads/${photoPath}`;
}

handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/images/quiz-placeholder.png'; // Add a fallback image
  img.style.opacity = '0.7';
}

}