import { Component, OnInit } from '@angular/core';
import { ParticipantService } from 'src/app/services/participant.service';
import { Participant } from 'src/app/models/participant';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  participants: Participant[] = [];

  total = 0;
  completed = 0;
  dropped = 0;
  enrolled = 0;

  badgeStats: { [key: string]: number } = {};

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.participantService.getAllParticipants().subscribe(data => {
      this.participants = data;
      this.computeStatistics();
    });
  }

  computeStatistics(): void {
    this.total = this.participants.length;
    this.completed = this.participants.filter(p => p.status === 'COMPLETED').length;
    this.dropped = this.participants.filter(p => p.status === 'DROPPED').length;
    this.enrolled = this.participants.filter(p => p.status === 'ENROLLED').length;

    this.badgeStats = {};
    this.participants.forEach(p => {
      const badge = this.calculateBadge(p.grade, p.status);
      if (this.badgeStats[badge]) this.badgeStats[badge]++;
      else this.badgeStats[badge] = 1;
    });
  }

  calculateBadge(grade: number | null | undefined, status: string): string {
    if (status === 'COMPLETED') {
      if (grade != null) {
        if (grade >= 90) return "🏅 Excellent";
        if (grade >= 75) return "🥈 Très Bien";
        if (grade >= 60) return "🥉 Bien";
        return "📘 Passable";
      }
    }
    return "⏳ En Cours";
  }

  exportToExcel(): void {
    const dataToExport = this.participants.map(p => ({
      ID: p.id,
      'User ID': p.user?.id,
      Username: p.user?.username,
      Email: p.user?.email,
      'Training Program ID': p.trainingProgramId,
      Status: p.status,
      Grade: p.grade,
      Cheated: p.cheated ? 'Oui' : 'Non',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = { Sheets: { 'Participants': worksheet }, SheetNames: ['Participants'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'admin_dashboard_participants.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const head = [['ID', 'User ID', 'Username', 'Email', 'Training ID', 'Status', 'Grade', 'Cheated']];
    const data = this.participants.map(p => [
      p.id,
      p.user?.id ?? 'N/A',
      p.user?.username ?? 'N/A',
      p.user?.email ?? 'N/A',
      p.trainingProgramId,
      p.status,
      p.grade ?? 'N/A',
      p.cheated ? '🚨 Oui' : '✅ Non'
    ]);

    autoTable(doc, {
      head: head,
      body: data,
      startY: 20,
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 255] },
    });

    doc.save('admin_dashboard_participants.pdf');
  }
}
