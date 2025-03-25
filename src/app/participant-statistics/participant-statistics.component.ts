import { Component, OnInit } from '@angular/core';
import { ParticipantStatisticsService } from 'src/app/services/participant-statistics.service';

@Component({
  selector: 'app-participant-statistics',
  templateUrl: './participant-statistics.component.html',
  styleUrls: ['./participant-statistics.component.css']
})
export class ParticipantStatisticsComponent implements OnInit {
  stats: any[] = [];  // Cette variable contiendra les statistiques des participants
  errorMessage: string = '';  // Variable pour afficher un message d'erreur

  constructor(private participantStatisticsService: ParticipantStatisticsService) {}

  ngOnInit(): void {
    // Récupérer les statistiques des participants lors de l'initialisation du composant
    this.participantStatisticsService.getParticipantStatsByStatus().subscribe({
      next: (data) => {
        this.stats = data; // On stocke les statistiques dans la variable `stats`
      },
      error: (error) => {
        this.errorMessage = 'Error fetching participant statistics.'; // Gérer l'erreur
        console.error('Error fetching participant statistics:', error);
      },
    });
  }
}
