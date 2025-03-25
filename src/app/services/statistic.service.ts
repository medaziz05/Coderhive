import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private apiUrl = 'http://localhost:8222/api/statistics'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) { }

  getAverageRating(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average-rating`);
  }
  getTrainingsByCategory(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/trainings-by-category`);
  }
  getMostPopularTraining(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/most-popular`);
  }
 
}
