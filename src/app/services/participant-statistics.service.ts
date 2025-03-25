import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipantStatisticsService {
  private apiUrl = 'http://localhost:8022/api/statistics/participants/by-status'; // Remplacez l'URL par celle de votre API

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les statistiques des participants par statut
  getParticipantStatsByStatus(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
