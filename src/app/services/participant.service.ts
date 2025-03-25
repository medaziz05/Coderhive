import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant, ParticipantStatus } from '../models/participant';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private readonly apiUrl = `http://localhost:8222/api/v1/enrollment`;

  constructor(private http: HttpClient) {}

  /**
   * Get all participants
   */
  getAllParticipants(): Observable<Participant[]> {
    return this.http.get<Participant[]>(this.apiUrl);
  }

  /**
   * Get participant by ID
   */
  getParticipantById(id: number): Observable<Participant> {
    return this.http.get<Participant>(`${this.apiUrl}/${id}`);
  }

  /**
   * Enroll a participant in a training program
   */
  enrollParticipant(
    userId: number,
    trainingProgramId: number
  ): Observable<Participant> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('trainingProgramId', trainingProgramId.toString());

    return this.http.post<Participant>(`${this.apiUrl}/enroll`, null, {
      params,
    });
  }

  /**
   * Update participant status and optionally grade
   */
  updateParticipantStatus(
    id: number,
    status: ParticipantStatus,
    grade?: number
  ): Observable<Participant> {
    let params = new HttpParams().set('status', status);

    if (grade !== undefined) {
      params = params.set('grade', grade.toString());
    }

    return this.http.put<Participant>(`${this.apiUrl}/${id}/status`, null, {
      params,
    });
  }

  /**
   * Delete participant
   */
  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
