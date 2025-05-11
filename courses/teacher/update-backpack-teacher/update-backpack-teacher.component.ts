import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackpackService } from '../../services/backpack.service';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BackpackRequest } from '@app/courses/models/backpack.model';

@Component({
  selector: 'app-update-backpack-teacher',
  templateUrl: './update-backpack-teacher.component.html',
  styleUrls: ['./update-backpack-teacher.component.scss']
})
export class UpdateBackpackTeacherComponent implements OnInit {
  backpackId!: number;
  backpackRequest: BackpackRequest = {
    title: '',
    content: '',
  };
  selectedFile: File | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  currentImageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backpackService: BackpackService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.backpackId = +params['backpackId'];
      this.loadBackpackData(this.backpackId);
    });
  }

  loadBackpackData(backpackId: number): void {
    this.backpackService.getBackpackById(backpackId).subscribe({
      next: backpack => {
        this.backpackRequest = {
          title: backpack.title,
          content: backpack.content
        };
        this.currentImageUrl = backpack.imageUrl;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading documentation:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load documentation data';
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(this.backpackRequest)], { type: 'application/json' }));

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.backpackService.updateBackpack(this.backpackId, this.backpackRequest, this.selectedFile)
        .subscribe({
          next: () => {
            this.router.navigate(['/teacher/backpacks', this.backpackId]);
          },
          error: err => {
            console.error('Error updating documentation:', err);
            this.errorMessage = 'Failed to update documentation entry';
          },
        });
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.currentImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onCancel(): void {
    this.router.navigate(['/teacher/backpacks', this.backpackId]);
  }
}