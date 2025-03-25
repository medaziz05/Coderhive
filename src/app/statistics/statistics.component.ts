import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../services/statistic.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  averageRating: number = 0;
  trainingsByCategory: Map<string, number> = new Map(); // 📊 Répartition des formations par catégorie
  mostPopularTraining: any = null; // 📊 Formation la plus populaire

  constructor(private statisticService: StatisticService) { }

  ngOnInit(): void {
    // 1️⃣ Récupérer la note moyenne
    this.statisticService.getAverageRating().subscribe(data => {
      this.averageRating = parseFloat(data.toFixed(2)); // ✅ Arrondi à 2 décimales
    });

    // 2️⃣ Récupérer la répartition des formations par catégorie
    this.statisticService.getTrainingsByCategory().subscribe(data => {
      this.trainingsByCategory = data;
    });

    // 3️⃣ Récupérer la formation la plus populaire
    this.statisticService.getMostPopularTraining().subscribe(data => {
      this.mostPopularTraining = data;
    });
  }
}
