import { Component } from '@angular/core';
import { Complaint, ComplaintPriority, Status, TypeRec } from 'src/app/core/complaints';
import { ComplaintService } from 'src/app/services/complaint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-addfeedback',
  templateUrl: './addfeedback.component.html',
  styleUrls: ['./addfeedback.component.css']
})
export class AddfeedbackComponent {

  // Define the TypeRec enum values as an array to populate the dropdown
  typeRecOptions = Object.values(TypeRec);

  addfeedback: Complaint = {
    idcomplaint: 0,
    title: '',
    mail: '',
    description: '',
    date: new Date(),
    type: TypeRec.FORUM,
    status: Status.PENDING,
    isAnonymous: false,
    priority:ComplaintPriority.MEDIUM 
  };

  // Track validation states
  isTitleValid = true;
  isEmailValid = true;
  isDescriptionValid = true;
  isTypeValid = true;
  isSubmitting = false;

  constructor(private complaintService: ComplaintService, private snackBar: MatSnackBar) { }

  // Validate title on input change
  validateTitle(title: string) {
    this.isTitleValid = title.length >= 3;
  }

  // Validate email on input change
  validateEmail(email: string) {
    if (this.addfeedback.isAnonymous) {
      this.isEmailValid = true;
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(email);
}

  // Validate description on input change
  validateDescription(description: string) {
    this.isDescriptionValid = description.length >= 10;
  }

  // Validate type on selection change
  validateType(type: TypeRec) {
    this.isTypeValid = !!type;
  }
  onAnonymousChange() {
    this.addfeedback.mail = this.addfeedback.isAnonymous ? 'anonyme@anonyme.com' : '';
    // Re-validate email if switching back to non-anonymous
    if (!this.addfeedback.isAnonymous) {
      this.validateEmail(this.addfeedback.mail);
    } else {
      this.isEmailValid = true;
    }
  }

  validateForm(): boolean {
    this.validateTitle(this.addfeedback.title);
    this.validateDescription(this.addfeedback.description);
    this.validateType(this.addfeedback.type);
    
    if (!this.addfeedback.isAnonymous) {
      this.validateEmail(this.addfeedback.mail);
    }

    return this.isTitleValid && 
           this.isDescriptionValid && 
           this.isTypeValid && 
           (this.addfeedback.isAnonymous || this.isEmailValid);
  }



  onSubmit() {
    if (this.isSubmitting) return;
    // Perform final validation check
    if (!this.validateForm()) {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 3000,
      });
      return;
    }

    console.log('Envoi du formulaire:', this.addfeedback);
    this.isSubmitting = true;
    
    const submitObservable = this.addfeedback.isAnonymous
      ? this.complaintService.createAnonymousComplaint(this.addfeedback)
      : this.complaintService.createComplaint(this.addfeedback);
    
    submitObservable
      .pipe(
        catchError(err => {
          console.error('Erreur de soumission:', err);
          this.snackBar.open(`Erreur lors de la soumission: ${err.error?.message || 'Erreur serveur'}`, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of(null);
        }),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe(response => {
        if (response) {
          console.log('Réclamation soumise avec succès:', response);
          
          // Afficher une notification de succès avec snackBar au lieu de NotificationService
          this.snackBar.open('Votre réclamation a été soumise avec succès.', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          setTimeout(() => this.resetForm(), 500); // Petite pause avant réinitialisation
        }
      });
  }

  // Helper function to reset the form
  private resetForm() {
    this.addfeedback = {
      idcomplaint: 0,
      title: '',
      mail: '',
      description: '',
      date: new Date(),
      type: TypeRec.FORUM,
      status: Status.PENDING,
      isAnonymous: false,
      priority:ComplaintPriority.MEDIUM
    };
    this.isTitleValid = true;
    this.isEmailValid = true;
    this.isDescriptionValid = true;
    this.isTypeValid = true;
  }
}
