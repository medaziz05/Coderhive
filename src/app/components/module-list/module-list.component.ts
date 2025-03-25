import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { Module } from '../../models/module';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit {
  modules: Module[] = [];
  errorMessage = '';
  loading = true;

  constructor(private moduleService: ModuleService) {}

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules(): void {
    this.loading = true;
    this.moduleService.getAllModules().subscribe({
      next: (data) => {
        this.modules = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = "Erreur lors du chargement des modules.";
        console.error('Erreur:', error);
        this.loading = false;
      }
    });
  }

  deleteModule(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce module ?')) {
      this.moduleService.deleteModule(id).subscribe({
        next: () => {
          this.modules = this.modules.filter(module => module.id !== id);
          alert('Module supprimé avec succès.');
        },
        error: (error) => {
          console.error('Erreur suppression:', error);
          alert('Échec de la suppression du module.');
        }
      });
    }
  }
  confirmDelete(moduleId: number): void {
    const confirmDeletion = window.confirm("Êtes-vous sûr de vouloir supprimer ce module ?");
    if (confirmDeletion) {
      this.deleteModule(moduleId);
    }
  }

  
}
