import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-simulated-login',
  templateUrl: './simulated-login.component.html'
})
export class SimulatedLoginComponent {
  selectedUserId: number = 1;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.selectedUserId);
    alert("Connecté en tant qu'utilisateur ID = " + this.selectedUserId);
  }
}
