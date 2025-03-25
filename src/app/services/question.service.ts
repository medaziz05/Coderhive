import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';




@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = 'http://localhost:8222/api/v1/training/questions'; // Remplacez avec l'URL réelle de votre API

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer toutes les questions
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  // Méthode pour récupérer une question par son ID
  getQuestionById(id: number): Observable<Question> {
    console.log("Envoi de la requête avec ID:", id); // Vérifie si l'ID est un nombre
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }
  
  }

