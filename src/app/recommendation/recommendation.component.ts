import { Component, OnInit } from '@angular/core';
import { TrainingProgram } from '../models/trainingprogram';
import { RecommendationService } from '../services/recommendation.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  recommendations: TrainingProgram[] = [];

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.recommendationService.getRecommendations().subscribe({
      next: (data) => {
        console.log("Données reçues :", data); // Vérifie dans la console navigateur
        this.recommendations = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des recommandations :", err);
      }
    });
  }
}
