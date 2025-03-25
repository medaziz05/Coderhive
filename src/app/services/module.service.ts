import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module } from '../models/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = 'http://localhost:8222/api/v1/training/module';

  constructor(private http: HttpClient) {}

  // ✅ Corrige la route de création de module et adapte la requête si le backend attend `trainingProgramId`
  createModule(module: Module): Observable<Module> {
    const requestBody = {
      ...module,
      trainingProgramId: module.trainingProgram?.id // 🔥 Ajoute `trainingProgramId` si nécessaire
    };
    return this.http.post<Module>(this.apiUrl, requestBody);
  }

  // ✅ Corrige la route pour récupérer tous les modules
  getAllModules(): Observable<Module[]> {
    return this.http.get<Module[]>(this.apiUrl);
  }

  // ✅ Supprime un module par ID
  deleteModule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
