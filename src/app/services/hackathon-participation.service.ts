import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HackathonParticipation } from '../models/hackathon-participation';

@Injectable({
  providedIn: 'root',
})
export class HackathonParticipationService {
  private baseUrl = 'http://localhost:8222/api/v1/hackathons';

  constructor(private http: HttpClient) {}

  joinHackathon(
    hackathonId: number,
    userId: number
  ): Observable<HackathonParticipation> {
    return this.http.post<HackathonParticipation>(
      `${this.baseUrl}/join?hackathonId=${hackathonId}&userId=${userId}`,
      {}
    );
  }

  // Unjoin a hackathon
  unjoinHackathon(hackathonId: number, userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/unjoin?hackathonId=${hackathonId}&userId=${userId}`
    );
  }

  // Get user participation list
  getUserParticipations(userId: number): Observable<HackathonParticipation[]> {
    return this.http.get<HackathonParticipation[]>(
      `${this.baseUrl}/user/${userId}`
    );
  }

  // Get participants of a hackathon
  getHackathonParticipants(
    hackathonId: number
  ): Observable<HackathonParticipation[]> {
    return this.http.get<HackathonParticipation[]>(
      `${this.baseUrl}/hackathon/${hackathonId}`
    );
  }

  // Get the number of participants in a hackathon
  getParticipantCount(hackathonId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/${hackathonId}`);
  }

  // Check if a user is participating in a hackathon
  isUserParticipating(
    hackathonId: number,
    userId: number
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/status?hackathonId=${hackathonId}&userId=${userId}`
    );
  }
}
