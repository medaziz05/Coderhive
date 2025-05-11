import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackpackList } from '@app/courses/models/backpack.model';
import { BackpackService } from '@app/courses/services/backpack.service';

@Component({
  selector: 'app-backpack-list-teacher',
  templateUrl: './backpack-list-teacher.component.html',
  styleUrls: ['./backpack-list-teacher.component.scss']
})
export class BackpackListTeacherComponent implements OnInit {
  backpacks: BackpackList[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private backpackService: BackpackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBackpacks();
  }

  loadBackpacks(): void {
    this.loading = true;
    this.backpackService.getAllBackpacks().subscribe({
      next: data => {
        this.backpacks = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading documentation:', err);
        this.errorMessage = 'Failed to load documentation entries';
        this.loading = false;
      }
    });
  }

  deleteBackpack(backpackId: number): void {
    if (confirm('Are you sure you want to delete this documentation entry?')) {
      this.backpackService.deleteBackpack(backpackId).subscribe({
        next: () => {
          this.backpacks = this.backpacks.filter(b => b.backpackId !== backpackId);
        },
        error: err => {
          console.error('Error deleting entry:', err);
        }
      });
    }
  }

  viewDetails(backpackId: number): void {
    this.router.navigate(['/teacher/backpacks', backpackId]);
  }
}