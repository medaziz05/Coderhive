import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  // Method to check if user is admin
  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  // Method to check if user is logged in
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Logout method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Mobile menu toggle
  toggleMobileMenu(): void {
    // Implement your mobile menu toggle logic here
  }
}