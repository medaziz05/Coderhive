import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DifficultyLevel, ImportanceLevel } from 'src/app/models/hackathon';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-admincreate-hackathon',
  templateUrl: './admincreate-hackathon.component.html',
  styleUrls: ['./admincreate-hackathon.component.css'],
})
export class AdmincreateHackathonComponent {
  hackathonForm: FormGroup;
  niveauDifficulte = Object.values(DifficultyLevel);
  niveauImportance = Object.values(ImportanceLevel);

  constructor(
    private fb: FormBuilder,
    private hackathonService: HackathonService,
    private router: Router
  ) {
    this.hackathonForm = this.fb.group(
      {
        title: [
          '',
          [
            Validators.required,
            Validators.pattern('^[^0-9]*$') // n'autorise aucun chiffre
          ],
        ],
        description: [
          '',
          [
            Validators.required,
            Validators.pattern('^[^0-9]*$') // n'autorise aucun chiffre
          ],
        ],
        location: [
          '',
          [
            Validators.required,
            Validators.pattern('^[^0-9]*$') // n'autorise aucun chiffre
          ],
        ],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        nbrPlaces: ['', [Validators.required, Validators.min(1)]],
        niveauDifficulte: ['', Validators.required],
        niveauImportance: ['', Validators.required],
      },
      { validators: this.dateRangeValidator }
    );
  }

  // Validateur personnalisé pour vérifier que startTime < endTime
  dateRangeValidator(formGroup: AbstractControl) {
    const start = formGroup.get('startTime')?.value;
    const end = formGroup.get('endTime')?.value;
    if (start && end && new Date(start) >= new Date(end)) {
      return { dateRange: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.hackathonForm.invalid) {
      this.hackathonForm.markAllAsTouched();
      alert("Impossible de créer : Veuillez corriger les erreurs du formulaire.");
      return;
    }
    const hackathonData = this.hackathonForm.value;
    // Affecte la date de création à la date d'aujourd'hui
    hackathonData.createdAt = new Date();
    this.hackathonService.createHackathon(hackathonData).subscribe({
      next: () => {
        alert('Hackathon created successfully!');
        this.router.navigate(['/hackathon_home_admin']);
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to create hackathon');
      },
    });
  }

  // Bouton Retour : redirige vers la liste des hackathons côté admin
  onBack(): void {
    this.router.navigate(['/hackathon_home_admin']);
  }
}
