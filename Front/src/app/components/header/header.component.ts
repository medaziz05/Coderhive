import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  // Method to check if the user is an admin
  isAdmin(): boolean {
    return this.authService.hasRole('admin'); // Adjust based on your role-checking logic
  }
}
