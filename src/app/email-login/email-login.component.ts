import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html'
})
export class EmailLoginComponent {
  email: string = '';
  username: string = '';
  error: string = '';
  success: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    if (!this.email || !this.username) {
      this.error = "Tous les champs sont requis.";
      return;
    }

    this.http.post('http://localhost:8222/api/v1/users/register', {
      email: this.email,
      username: this.username
    }).subscribe({
      next: () => {
        this.success = "Inscription réussie 🎉";
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: err => {
        this.error = err.status === 409
          ? "Cet email est déjà utilisé."
          : "Erreur lors de l'inscription.";
      }
    });
  }
}
