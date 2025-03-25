import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingProgram } from 'src/app/models/trainingprogram';
import { TrainingprogramService } from 'src/app/services/trainingprogram.service';

@Component({
  selector: 'app-training-program-list',
  templateUrl: './training-program-list.component.html',
  styleUrls: ['./training-program-list.component.css'],
})
export class TrainingProgramListComponent implements OnInit {
  trainingPrograms: TrainingProgram[] = [];
  loading = true;
  errorMessage = '';
  programToDelete?: number;

  constructor(
    private trainingService: TrainingprogramService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainingPrograms();
  }

  loadTrainingPrograms(): void {
    this.loading = true;
    this.errorMessage = '';

    this.trainingService.getAllTrainingPrograms().subscribe({
      next: (programs) => {
        this.trainingPrograms = programs;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Error loading training programs. Please try again.';
        this.loading = false;
      },
    });
  }

  editProgram(id?: number): void {
    if (id) {
      this.router.navigate(['/update-training', id]);
    }
  }

  deleteProgram(id?: number): void {
    if (confirm('Are you sure you want to delete this program?')) {
      this.trainingService.deleteTrainingProgram(id).subscribe({
        next: () => {
          alert('training deleted successfully!');
          location.reload(); // Reload the page to update the post list
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to delete training');
        },
      });
    }
  }

  // Helper method to generate random progress for demo
  getRandomProgress(): number {
    return Math.floor(Math.random() * 100);
  }
}
