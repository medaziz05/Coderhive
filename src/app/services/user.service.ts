import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { User } from "../models/user";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8222/api/v1/enrollment/users';

  constructor(private http: HttpClient) {}

 

  login(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/login?email=${email}`);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8222/api/v1/enrollment/users/all');
  }
  
}
