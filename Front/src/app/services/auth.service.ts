import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;
  private readonly users = [
    { email: 'admin@admin.com', password: 'admin123', role: 'admin', id: 1 },
    { email: 'user@user.com', password: 'user123', role: 'user', id: 2 }
  ];

  constructor(private router: Router) { }

  login(email: string, password: string): string | null {
    const user = this.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      this.currentUser = { ...user }; // Create a copy to prevent reference issues
      return user.role;
    }
    return null;
  }

  logout(): void {
    this.currentUser = null;
    this.router.navigate(['/']);
    // Consider adding localStorage.removeItem('currentUser') if persisting sessions
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // Kept as requested
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Alias for hasRole('admin') for better readability
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  getUserId(): number {
    return this.currentUser?.id || 0;
  }

  // Additional helpful method
  getCurrentUserEmail(): string | null {
    return this.currentUser?.email || null;
  }

  // Optional: For debugging
  getCurrentUserInfo(): any {
    return this.currentUser ? { ...this.currentUser } : null;
  }
  
}