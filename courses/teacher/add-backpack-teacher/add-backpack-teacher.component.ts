import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackpackRequest } from '@app/courses/models/backpack.model';
import { BackpackService } from '@app/courses/services/backpack.service';

@Component({
  selector: 'app-add-backpack-teacher',
  templateUrl: './add-backpack-teacher.component.html',
  styleUrls: ['./add-backpack-teacher.component.scss']
})
export class AddBackpackTeacherComponent implements OnInit  {

  backpackRequest: BackpackRequest = {
    title: '',
    content: ''
  };
  
  selectedFile: File | null = null;
  previewUrl: SafeUrl | string = '/assets/images/shape/select-thumb.webp';
  loading = false;
  formSubmitted = false;
  errorMessage: string | null = null;

  constructor(
    private backpackService: BackpackService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}
  ngOnInit(): void {
    // Implement the necessary logic or leave it empty if not needed
    this.loading = false;
  }
  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit(form: NgForm): void {
    this.formSubmitted = true;
    this.errorMessage = null;

    if (form.valid) {
      this.loading = true;

      const formData = new FormData();
      formData.append(
        'request',
        new Blob([JSON.stringify(this.backpackRequest)], { type: 'application/json' })
      );

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.backpackService.createBackpack(formData).subscribe({
        next: (createdBackpack) => {
          // After backpack creation, navigate to backpack list
          this.router.navigate(['/teacher/backpacks']); 
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to create documentation entry';
          console.error('Backpack creation error:', err);
        },
      });
    } else {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
  

  onCancel(): void {
    this.router.navigate(['/teacher/backpacks']);
  }

}