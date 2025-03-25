import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingProgram } from '../models/trainingprogram';



@Injectable({
  providedIn: 'root',
})
export class TrainingprogramService {
  private readonly apiUrl = `http://localhost:8222/api/v1/training`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all training programs
   */
  getAllTrainingPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(this.apiUrl);
  }

  /**
   * Retrieves a specific training program by ID
   */
  getTrainingProgramById(id: number): Observable<TrainingProgram> {
    return this.http.get<TrainingProgram>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new training program
   */
  createTrainingProgram(
    trainingProgram: TrainingProgram
  ): Observable<TrainingProgram> {
    return this.http.post<TrainingProgram>(this.apiUrl, trainingProgram);
  }

  /**
   * Updates an existing training program
   */
  updateTrainingProgram(
    id: number,
    trainingProgram: TrainingProgram
  ): Observable<TrainingProgram> {
    return this.http.put<TrainingProgram>(
      `${this.apiUrl}/${id}`,
      trainingProgram
    );
  }

  /**
   * Deletes a training program
   */
  deleteTrainingProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
