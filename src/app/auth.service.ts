import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userIdKey = 'loggedUserId';

  login(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }
  
  getLoggedUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? +id : null;
  }
  
}


