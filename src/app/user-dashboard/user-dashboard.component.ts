import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  participations: any[] = [];
  message: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getLoggedUserId();
    console.log("🎯 userId Angular =", userId); // Log utile pour debug

    if (!userId) return;

    this.http.get<any[]>(`/api/v1/enrollment/user/${userId}/participants`)
      .subscribe(participations => {
        if (participations.length === 0) {
          this.message = "Aucune participation trouvée. Inscription automatique à une formation...";
          
          // 🛠️ Inscription automatique à la formation ID = 1
          this.http.post(`/api/v1/enrollment/enroll`, null, {
            params: {
              userId: userId.toString(),
              trainingProgramId: '1'
            }
          }).subscribe(() => {
            this.message = "Inscription effectuée ! Chargement...";
            this.ngOnInit(); // 🔁 Recharge après inscription
          }, () => {
            this.message = "Erreur lors de l'inscription automatique.";
          });
        } else {
          this.participations = participations;
          this.message = '';
        }
      }, () => {
        this.message = "Erreur lors de la récupération des participations.";
      });
  }
}
