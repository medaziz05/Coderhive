import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingProgram } from 'src/app/models/trainingprogram';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  private apiUrl = 'http://localhost:8022/api/suggestions'; // URL de ton backend

  constructor(private http: HttpClient) {}

  getSuggestions(trainingProgramId: number): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/${trainingProgramId}`);
  }
}
