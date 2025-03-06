import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint, ComplaintPriority } from '../core/complaints';
import { ComplaintResponse } from '../core/ComplaintResponse';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = "http://localhost:8089/api/complaints";
  private responseUrl = "http://localhost:8089/api/responses"; // Add the response URL

  constructor(private http: HttpClient) { }

  // Get all complaints
  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  // Get a complaint by ID
  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  // Create a new complaint
  createComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }
  createAnonymousComplaint(complaint: Complaint): Observable<Complaint> {
    // Marquer la plainte comme anonyme avant l'envoi
    complaint.isAnonymous = true;
    complaint.mail = "anonyme@anonyme.com";
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }
  getAnonymousComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/anonymous`);
  }

  // Get non-anonymous complaints
  getNonAnonymousComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/non-anonymous`);
  }

  // Update an existing complaint
  updateComplaint(id: number, complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint);
  }

  // Delete a complaint by ID
  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get complaints by status
  getComplaintsByStatus(status: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get complaints by email
  getComplaintsByEmail(email: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/mail/${email}`);
  }

  // Get complaints within a date range
  getComplaintsByDateRange(start: string, end: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/date-range?start=${start}&end=${end}`);
  }

  // Get recent complaints
  getRecentComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/recent`);
  }

  // Get complaints by type
  getComplaintsByType(type: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/type/${type}`);
  }

  // Get the total count of complaints
  getComplaintsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // Get the count of complaints by status
  getComplaintsCountByStatus(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/status/${status}`);
  }
  getStatistics(): Observable<any> { // Change return type to any or create a Statistics interface
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
  declineComplaint(id: number): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}/decline`, {});
  }
  createResponse(complaintId: number, response: ComplaintResponse): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(`${this.responseUrl}/complaint/${complaintId}`, response);
  }
  getComplaintsFromNewToOld(newDate: string, oldDate: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/filter?newDate=${newDate}&oldDate=${oldDate}`);
}
searchByTitle(title: string): Observable<Complaint[]> {
  let params = new HttpParams();

  if (title) {
    params = params.set('title', title);
  }
  return this.http.get<Complaint[]>(`${this.apiUrl}/search`, { params });
}

getComplaintsByPriority(priority: ComplaintPriority): Observable<Complaint[]> {
  return this.http.get<Complaint[]>(`${this.apiUrl}/priority/${priority}`);
}


}
