import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackpackDetails, BackpackList, BackpackRequest } from '../models/backpack.model';

@Injectable({
  providedIn: 'root'
})
export class BackpackService {
  private apiUrl = 'http://localhost:8081/api/backpacks';

  constructor(private http: HttpClient) { }

  getAllBackpacks(): Observable<BackpackList[]> {
    return this.http.get<BackpackList[]>(this.apiUrl);
  }

  getBackpackById(id: number): Observable<BackpackDetails> {
    return this.http.get<BackpackDetails>(`${this.apiUrl}/${id}`);
  }

  createBackpack(backpackData: FormData): Observable<BackpackDetails> {
    return this.http.post<BackpackDetails>(this.apiUrl, backpackData);
  }

  updateBackpack(id: number, backpackRequest: BackpackRequest, imageFile: File | null): Observable<BackpackDetails> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(backpackRequest)], { type: 'application/json' }));
    
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }
    
    return this.http.put<BackpackDetails>(`${this.apiUrl}/${id}`, formData);
  }

  deleteBackpack(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}