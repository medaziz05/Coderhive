// participant-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Participant, ParticipantStatus } from 'src/app/models/participant';
import { TrainingProgram } from 'src/app/models/trainingprogram';
import { ParticipantService } from 'src/app/services/participant.service';
import { TrainingprogramService } from 'src/app/services/trainingprogram.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css'],
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  trainingPrograms: TrainingProgram[] = [];
  selectedParticipant?: Participant;

  newParticipant = {
    userId: 0,
    trainingProgramId: 0,
  };

  searchUserId: string = '';
  searchTrainingId: string = '';
  statusOptions = Object.values(ParticipantStatus);

  constructor(
    private participantService: ParticipantService,
    private trainingProgramService: TrainingprogramService
  ) {}

  ngOnInit(): void {
    this.getParticipants();
    this.getTrainingPrograms();
  }

  getParticipants(): void {
    this.participantService.getAllParticipants().subscribe({
      next: (data) => {
        this.participants = data;
        this.filteredParticipants = data;
      },
      error: (error) => console.error('Error fetching participants:', error),
    });
  }

  getTrainingPrograms(): void {
    this.trainingProgramService.getAllTrainingPrograms().subscribe({
      next: (programs) => (this.trainingPrograms = programs),
      error: (error) => console.error('Error fetching training programs:', error),
    });
  }

  enrollParticipant(): void {
    const { userId, trainingProgramId } = this.newParticipant;
    if (userId && trainingProgramId) {
      this.participantService.enrollParticipant(userId, trainingProgramId).subscribe({
        next: (participant) => {
          this.participants.push(participant);
          this.filteredParticipants = this.participants;
          this.newParticipant = { userId: 0, trainingProgramId: 0 };
        },
        error: (error) => console.error('Error enrolling participant:', error),
      });
    }
  }

  updateStatus(): void {
    if (this.selectedParticipant) {
      this.participantService.updateParticipantStatus(
        this.selectedParticipant.id!,
        this.selectedParticipant.status,
        this.selectedParticipant.grade
      ).subscribe({
        next: (updated) => {
          const index = this.participants.findIndex(p => p.id === updated.id);
          if (index !== -1) this.participants[index] = updated;
          this.filteredParticipants = this.participants;
          this.selectedParticipant = undefined;
        },
        error: (error) => console.error('Error updating status:', error),
      });
    }
  }

  deleteParticipant(id: number): void {
    if (confirm('Are you sure you want to delete this participant?')) {
      this.participantService.deleteParticipant(id).subscribe({
        next: () => {
          this.participants = this.participants.filter(p => p.id !== id);
          this.filteredParticipants = this.participants;
        },
        error: (error) => console.error('Error deleting participant:', error),
      });
    }
  }

  search(): void {
    const uid = this.searchUserId.trim();
    const tid = this.searchTrainingId.trim();
    this.filteredParticipants = this.participants.filter(p => {
      const matchesUser = uid ? p.userId.toString().includes(uid) : true;
      const matchesTraining = tid ? p.trainingProgramId.toString().includes(tid) : true;
      return matchesUser && matchesTraining;
    });
  }

  clearSearch(): void {
    this.searchUserId = '';
    this.searchTrainingId = '';
    this.filteredParticipants = this.participants;
  }

  selectParticipant(participant: Participant): void {
    this.selectedParticipant = { ...participant };
  }
}
