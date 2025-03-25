import { Component, OnInit } from '@angular/core';
import { Participant, ParticipantStatus } from 'src/app/models/participant';

@Component({
  selector: 'app-statisticss',
  templateUrl: './statisticss.component.html',
  styleUrls: ['./statisticss.component.css']
})
export class StatisticssComponent implements OnInit {
  // Mise à jour des participants avec les nouvelles données
  participants: Participant[] = [
    { userId: 5, trainingProgramId: 2, status: ParticipantStatus.ENROLLED, grade: 0 },
    { userId: 9, trainingProgramId: 3, status: ParticipantStatus.ENROLLED, grade: 0 },
    { userId: 5, trainingProgramId: 2, status: ParticipantStatus.ENROLLED, grade: 0 },
    { userId: 2, trainingProgramId: 3, status: ParticipantStatus.ENROLLED, grade: 0 },
    { userId: 10, trainingProgramId: 2, status: ParticipantStatus.ENROLLED, grade: 0 },
    { userId: 12, trainingProgramId: 2, status: ParticipantStatus.ENROLLED, grade: 0 },
    { userId: 5, trainingProgramId: 130, status: ParticipantStatus.ENROLLED, grade: 0 },
    { userId: 5, trainingProgramId: 3, status: ParticipantStatus.ENROLLED, grade: 0 },
  ];

  // Statistiques des participants
  statusCounts: { [key in ParticipantStatus]: number } = {
    [ParticipantStatus.ENROLLED]: 0,
    [ParticipantStatus.COMPLETED]: 0,
    [ParticipantStatus.DROPPED]: 0,
  };

  totalParticipants = 0;  // Total des participants inscrits
  chartData: { status: string; count: number; percentage: number; color: string }[] = [];

  ngOnInit() {
    this.calculateStatusCounts(); // Calcul du nombre de participants par statut
    this.prepareChartData();      // Préparer les données pour les graphiques
  }

  // Calculer le nombre de participants par statut
  calculateStatusCounts() {
    this.participants.forEach((participant) => {
      this.statusCounts[participant.status]++;
      this.totalParticipants++;  // Augmenter le nombre total de participants
    });
  }

  // Préparer les données pour les graphiques
  prepareChartData() {
    const colors = {
      [ParticipantStatus.ENROLLED]: "#3498db",
      [ParticipantStatus.COMPLETED]: "#2ecc71",
      [ParticipantStatus.DROPPED]: "#e74c3c",
    };

    // Ajouter les données dans le tableau `chartData` pour chaque statut
    for (const status in this.statusCounts) {
      const count = this.statusCounts[status as ParticipantStatus];
      const percentage = (count / this.totalParticipants) * 100;
      this.chartData.push({
        status,
        count,
        percentage,
        color: colors[status as ParticipantStatus],
      });
    }
  }

  // Calculer l'offset pour chaque section du graphique
  getOffset(index: number): number {
    return this.chartData.slice(0, index).reduce((sum, data) => sum + data.percentage, 0);
  }

  // Convertir les angles pour dessiner l'arc du graphique circulaire
  describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, "L", x, y, "Z"].join(" ");
  }

  // Convertir les coordonnées polaires en coordonnées cartésiennes
  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }
}
