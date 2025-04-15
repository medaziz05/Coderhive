import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';

  constructor(private userService: UserService, private router: Router) {}

  register(): void {
    const user = {
      username: this.username,
      email: this.email
    };

    this.userService.registerUser(user).subscribe({
      next: (response) => {
        console.log('✅ Utilisateur enregistré :', response);
        localStorage.setItem('participantName', response.username); // récupère depuis le backend
        alert('🎉 Bienvenue ' + response.username + ' !');
        this.router.navigate(['/trainingprogram-detail', 1]);
      },
      error: (err) => {
        console.error('❌ Erreur d\'inscription :', err);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    });
  }
}
