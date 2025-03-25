import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Currency, TrainingProgram } from 'src/app/models/trainingprogram';
import { TrainingprogramService } from 'src/app/services/trainingprogram.service';

@Component({
  selector: 'app-update-training',
  templateUrl: './update-training.component.html',
  styleUrls: ['./update-training.component.css'],
})
export class UpdateTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  currencies = Object.values(Currency);
  loading = true;
  submitting = false;
  errorMessage = '';
  programId: number;

  constructor(
    private fb: FormBuilder,
    private trainingProgramService: TrainingprogramService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap((params) => (this.programId = params['id'])),
        switchMap((params) =>
          this.trainingProgramService.getTrainingProgramById(params['id'])
        )
      )
      .subscribe({
        next: (program) => {
          this.populateForm(program);
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage =
            'Error loading training program. Please try again.';
          this.loading = false;
        },
      });
  }

  private createForm(): void {
    this.trainingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      prerequisites: [''],
      objectives: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      currency: [Currency.USD, Validators.required],
      trainerId: ['', Validators.required],
    });
  }

  private populateForm(program: TrainingProgram): void {
    this.trainingForm.patchValue({
      title: program.title,
      description: program.description,
      duration: program.duration,
      prerequisites: program.prerequisites,
      objectives: program.objectives,
      price: program.price,
      currency: program.currency,
      trainerId: program.trainerId,
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid && !this.submitting) {
      this.submitting = true;
      this.errorMessage = '';

      const updatedProgram: TrainingProgram = {
        ...this.trainingForm.value,
        id: this.programId,
      };

      this.trainingProgramService
        .updateTrainingProgram(this.programId, updatedProgram)
        .subscribe({
          next: (response) => {
            this.submitting = false;
            this.router.navigate(['/listtraining']);
          },
          error: (error) => {
            this.submitting = false;
            this.errorMessage =
              'Error updating training program. Please try again.';
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/training-programs']);
  }
}
