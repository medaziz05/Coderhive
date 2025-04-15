import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    this.userService.login(this.email).subscribe({
      next: (user) => {
        console.log('✅ Connexion réussie :', user);
        localStorage.setItem('participantName', user.username);
        alert('🎉 Bienvenue ' + user.username + ' !');
  
        // 🔁 Redirection vers la page training/1
        this.router.navigate(['/training', 1]);
      },
      error: (err) => {
        console.error('❌ Erreur de connexion :', err);
        alert('Erreur lors de la connexion. Veuillez réessayer.');
      }
    });
   

  }
  
}
