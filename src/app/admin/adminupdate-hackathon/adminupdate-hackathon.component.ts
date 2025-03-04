import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DifficultyLevel, Hackathon, ImportanceLevel } from 'src/app/models/hackathon';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-adminupdate-hackathon',
  templateUrl: './adminupdate-hackathon.component.html',
  styleUrls: ['./adminupdate-hackathon.component.css'],
})
export class AdminupdateHackathonComponent implements OnInit {
  hackathonForm!: FormGroup;
  hackathonId!: number;
  niveauDifficulte = Object.values(DifficultyLevel);
  niveauImportance = Object.values(ImportanceLevel);

  constructor(
    private fb: FormBuilder,
    private hackathonService: HackathonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hackathonId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialisation du formulaire avec les mêmes validations que pour la création
    this.hackathonForm = this.fb.group(
      {
        title: ['', [Validators.required, Validators.pattern('^[^0-9]*$')]],
        description: ['', [Validators.required, Validators.pattern('^[^0-9]*$')]],
        location: ['', [Validators.required, Validators.pattern('^[^0-9]*$')]],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        nbrPlaces: ['', [Validators.required, Validators.min(1)]],
        niveauDifficulte: ['', Validators.required],
        niveauImportance: ['', Validators.required],
      },
      { validators: this.dateRangeValidator }
    );

    // Récupération des données existantes pour pré-remplir le formulaire
    this.hackathonService.getHackathonById(this.hackathonId).subscribe({
      next: (hackathon: Hackathon) => {
        // Convertir les dates au format datetime-local (YYYY-MM-DDTHH:mm)
        this.hackathonForm.patchValue({
          title: hackathon.title,
          description: hackathon.description,
          location: hackathon.location,
          startTime: this.convertToDatetimeLocal(hackathon.startTime),
          endTime: this.convertToDatetimeLocal(hackathon.endTime),
          nbrPlaces: hackathon.nbrPlaces,
          niveauDifficulte: hackathon.niveauDifficulte,
          niveauImportance: hackathon.niveauImportance,
        });
      },
      error: (error) => {
        console.error('Error fetching hackathon:', error);
      },
    });
  }

  // Convertit une date en format "YYYY-MM-DDTHH:mm" pour le champ datetime-local
  convertToDatetimeLocal(date: Date): string {
    const d = new Date(date);
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Validateur personnalisé pour s'assurer que startTime < endTime
  dateRangeValidator(formGroup: AbstractControl) {
    const start = formGroup.get('startTime')?.value;
    const end = formGroup.get('endTime')?.value;
    if (start && end && new Date(start) >= new Date(end)) {
      return { dateRange: true };
    }
    return null;
  }

  onUpdateHackathon(): void {
    if (this.hackathonForm.invalid) {
      this.hackathonForm.markAllAsTouched();
      alert("Impossible de mettre à jour : veuillez corriger les erreurs du formulaire.");
      return;
    }
    const updatedData = this.hackathonForm.value;
    this.hackathonService.updateHackathon(this.hackathonId, updatedData).subscribe({
      next: () => {
        alert('Hackathon updated successfully!');
        this.router.navigate(['/hackathon_home_admin']);
      },
      error: (error) => {
        console.error('Error updating hackathon:', error);
        alert('Failed to update hackathon');
      },
    });
  }

  // Bouton Retour : redirige vers la liste des hackathons côté admin
  onBack(): void {
    this.router.navigate(['/hackathon_home_admin']);
  }
}
