import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParticipantHistoryDTO } from '../models/participant-history.model';
import { AuthService } from '../auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit {
  history: ParticipantHistoryDTO[] = [];
  recommendedProgramId: number = 0;
  recommendedText: string = '';

  // 📊 Bar chart
  barChartLabels: string[] = [];
  barChartData: any[] = [];
  barChartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const userId = this.authService.getLoggedUserId();
    if (!userId) return;

    this.http.get<ParticipantHistoryDTO[]>(`/api/v1/enrollment/history/${userId}`).subscribe(data => {
      this.history = data;
      this.prepareChartData();
    });

    this.http.get(`/api/v1/enrollment/recommend/${userId}`, { responseType: 'text' }).subscribe(rec => {
      this.recommendedText = rec;
      if (rec.includes('Spring Boot')) this.recommendedProgramId = 3;
      if (rec.includes('Python')) this.recommendedProgramId = 5;
    });
  }

  prepareChartData() {
    this.barChartLabels = this.history.map(p => p.trainingTitle);
    this.barChartData = [
      {
        label: 'Note (%)',
        data: this.history.map(p => p.grade),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ];
  }

  getBadgeClass(badge: string): string {
    if (badge.includes('Excellent')) return 'badge bg-success';
    if (badge.includes('Très Bien')) return 'badge bg-primary';
    if (badge.includes('Passable')) return 'badge bg-warning text-dark';
    if (badge.includes('À revoir')) return 'badge bg-danger';
    return 'badge bg-secondary';
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.text('Historique des Participations', 14, 15);

    const rows = this.history.map(p => [
      p.trainingTitle,
      p.grade + '%',
      p.status,
      p.badge
    ]);

    autoTable(doc, {
      head: [['Formation', 'Note', 'Statut', 'Badge']],
      body: rows
    });

    doc.save('historique-participant.pdf');
  }
}
