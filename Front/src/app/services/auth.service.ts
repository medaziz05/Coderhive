import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { email: 'admin@admin.com', password: 'admin123', role: 'admin' },
    { email: 'user@user.com', password: 'user123', role: 'user' }
  ];

  constructor() { }

  login(email: string, password: string): string | null {
    const user = this.users.find(u => u.email === email && u.password === password);
    return user ? user.role : null;
  }

  hasRole(role: string): boolean {
    const user = this.users.find(u => u.role === role);
    return !!user; // Returns true if the user with the specified role exists
  }
}
