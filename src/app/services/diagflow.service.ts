import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {
  private projectId = 'trainingbot-japj'; // Ton Project ID
  private sessionId = Math.random().toString(36).substring(7); // Génère un ID unique
  private dialogflowUrl = `https://dialogflow.googleapis.com/v2/projects/${this.projectId}/agent/sessions/${this.sessionId}:detectIntent`;
  private token = 'AIzaSyCz51CTUR0ZsEdTyueJFPbrj3ujuwjT1Iw'; // Ajoute ton token ici

  constructor(private http: HttpClient) {}

  sendMessage(query: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      queryInput: {
        text: {
          text: query,
          languageCode: 'fr' // Change selon la langue souhaitée
        }
      }
    };

    return this.http.post(this.dialogflowUrl, body, { headers });
  }
}
