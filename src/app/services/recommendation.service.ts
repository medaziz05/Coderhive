import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingProgram } from '../models/trainingprogram';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://127.0.0.1:5000/recommendations'; // Assure-toi que c'est le bon endpoint

  constructor(private http: HttpClient) {}

  getRecommendations(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(this.apiUrl);
  }

  getPersonalizedRecommendations(userPreferences: { duration: number; priceRange: number[] }): Observable<TrainingProgram[]> {
    let params = new HttpParams()
      .set('max_duration', userPreferences.duration.toString())
      .set('min_price', userPreferences.priceRange[0].toString())
      .set('max_price', userPreferences.priceRange[1].toString());

    return this.http.get<TrainingProgram[]>(this.apiUrl, { params });
  }
}
