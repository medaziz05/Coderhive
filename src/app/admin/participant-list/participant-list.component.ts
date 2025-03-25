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
  trainingPrograms: TrainingProgram[] = [];
  selectedParticipant?: Participant;
  newParticipant: { userId: number; trainingProgramId: number } = {
    userId: 0,
    trainingProgramId: 0,
  };
  statusOptions = Object.values(ParticipantStatus);

  constructor(
    private participantService: ParticipantService,
    private trainingProgramService: TrainingprogramService
  ) {}

  ngOnInit(): void {
    this.getParticipants();
    this.getTrainingPrograms();
  }

  /**
   * Fetch all participants
   */
  getParticipants(): void {
    this.participantService.getAllParticipants().subscribe({
      next: (data) => {
        this.participants = data;
      },
      error: (error) => {
        console.error('Error fetching participants:', error);
      },
    });
  }

  getTrainingPrograms(): void {
    this.trainingProgramService.getAllTrainingPrograms().subscribe({
      next: (programs) => {
        this.trainingPrograms = programs;
      },
      error: (error) => {
        console.error('Error fetching training programs:', error);
      },
    });
  }

  /**
   * Select a participant for updates
   */
  selectParticipant(participant: Participant): void {
    this.selectedParticipant = { ...participant }; // Clone to avoid direct mutation
  }

  /**
   * Enroll a new participant
   */
  enrollParticipant(): void {
    if (this.newParticipant.userId && this.newParticipant.trainingProgramId) {
      this.participantService
        .enrollParticipant(
          this.newParticipant.userId,
          this.newParticipant.trainingProgramId
        )
        .subscribe({
          next: (participant) => {
            this.participants.push(participant);
            this.newParticipant = { userId: 0, trainingProgramId: 0 }; // Reset form
          },
          error: (error) => {
            console.error('Error enrolling participant:', error);
          },
        });
    }
  }

  /**
   * Update participant status
   */
  updateStatus(): void {
    if (this.selectedParticipant) {
      this.participantService
        .updateParticipantStatus(
          this.selectedParticipant.id!,
          this.selectedParticipant.status,
          this.selectedParticipant.grade
        )
        .subscribe({
          next: (updatedParticipant) => {
            const index = this.participants.findIndex(
              (p) => p.id === updatedParticipant.id
            );
            if (index !== -1) {
              this.participants[index] = updatedParticipant;
            }
            this.selectedParticipant = undefined;
          },
          error: (error) => {
            console.error('Error updating status:', error);
          },
        });
    }
  }

  /**
   * Delete a participant
   */
  deleteParticipant(id: number): void {
    if (confirm('Are you sure you want to delete this participant?')) {
      this.participantService.deleteParticipant(id).subscribe({
        next: () => {
          this.participants = this.participants.filter((p) => p.id !== id);
        },
        error: (error) => {
          console.error('Error deleting participant:', error);
        },
      });
    }
  }
}
