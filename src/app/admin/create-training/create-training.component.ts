import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Currency, type TrainingProgram } from "src/app/models/trainingprogram"
import { TrainingprogramService } from "src/app/services/trainingprogram.service"

@Component({
  selector: "app-create-training",
  templateUrl: "./create-training.component.html",
  styleUrls: ["./create-training.component.css"],
})
export class CreateTrainingComponent {
  trainingForm: FormGroup
  currencies = Object.values(Currency)

  constructor(
    private fb: FormBuilder,
    private trainingProgramService: TrainingprogramService,
    private router: Router,
  ) {
    this.createForm()
  }

  private createForm(): void {
    this.trainingForm = this.fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.pattern("^[a-zA-Z0-9 ]+$"), // Lettres, chiffres et espaces uniquement
        ],
      ],
      description: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      duration: ["", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1), Validators.max(1000)]],
      prerequisites: [
        "",
        [
          Validators.maxLength(200),
          Validators.pattern("^[a-zA-Z0-9,. ]+$"), // Lettres, chiffres, virgules, points et espaces
        ],
      ],
      objectives: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
          Validators.pattern("^[a-zA-Z0-9,. ]+$"), // Lettres, chiffres, virgules, points et espaces
        ],
      ],
      price: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(10000),
          Validators.pattern("^[0-9]+(.[0-9]{1,2})?$"), // Nombre avec jusqu'à 2 décimales
        ],
      ],
      currency: [Currency.USD, Validators.required],
      trainerId: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$"), Validators.maxLength(20)]],
    })
  }

  get f() {
    return this.trainingForm.controls
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      const trainingProgram: TrainingProgram = this.trainingForm.value

      this.trainingProgramService.createTrainingProgram(trainingProgram).subscribe({
        next: (response) => {
          console.log("Training program created successfully", response)
          this.trainingForm.reset()
          this.router.navigate(["/listtraining"])
        },
        error: (error) => {
          console.error("Error creating training program", error)
        },
      })
    } else {
      console.log("Form is invalid")
      this.markFormGroupTouched(this.trainingForm)
    }
  }

  onCancel(): void {
    this.trainingForm.reset()
  }

  // Nouvelle méthode pour marquer tous les champs comme touchés
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control)
      }
    })
  }

  // Nouvelle méthode pour vérifier si un champ est invalide et touché
  isFieldInvalid(fieldName: string): boolean {
    const field = this.trainingForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  // Nouvelle méthode pour obtenir les messages d'erreur
  getErrorMessage(fieldName: string): string {
    const field = this.trainingForm.get(fieldName)
    if (!field || !field.errors) return ""

    const errors = field.errors
    let errorMessage = ""

    if (errors["required"]) errorMessage = "This field is required."
    else if (errors["minlength"]) errorMessage = `Minimum length is ${errors["minlength"].requiredLength} characters.`
    else if (errors["maxlength"]) errorMessage = `Maximum length is ${errors["maxlength"].requiredLength} characters.`
    else if (errors["pattern"]) errorMessage = "Invalid format."
    else if (errors["min"]) errorMessage = `Minimum value is ${errors["min"].min}.`
    else if (errors["max"]) errorMessage = `Maximum value is ${errors["max"].max}.`

    return errorMessage
  }
}

