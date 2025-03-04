import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hackathon } from '../models/hackathon';
import { HackathonParticipation } from '../models/hackathon-participation';

@Injectable({
  providedIn: 'root',
})
export class HackathonService {
  private baseUrl = 'http://localhost:8222/api/v1/hackathons';

  constructor(private http: HttpClient) {}

  // Create Hackathon
  createHackathon(hackathon: Hackathon): Observable<Hackathon> {
    return this.http.post<Hackathon>(`${this.baseUrl}`, hackathon);
  }

  // Get Hackathon by ID
  getHackathonById(id: number): Observable<Hackathon> {
    return this.http.get<Hackathon>(`${this.baseUrl}/${id}`);
  }

  // Get All Hackathons with Pagination
  getAllHackathons(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  // Update Hackathon
  updateHackathon(id: number, hackathon: Hackathon): Observable<Hackathon> {
    return this.http.put<Hackathon>(`${this.baseUrl}/${id}`, hackathon);
  }

  // Delete Hackathon
  deleteHackathon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Get Hackathon Participants
  getHackathonParticipants(id: number): Observable<HackathonParticipation[]> {
    return this.http.get<HackathonParticipation[]>(
      `${this.baseUrl}/${id}/participants`
    );
  }
}
