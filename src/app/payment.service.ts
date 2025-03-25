import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8050/api/payment'; // Assure-toi que c'est la bonne URL backend

  constructor(private http: HttpClient) {}

  createCheckoutSession(trainingProgramId: number, currency: string): Observable<any> {
    return this.http.post<any>('http://localhost:8050/api/payment/create-checkout-session', {
      trainingProgramId,
      currency
    });
  }
  
}
