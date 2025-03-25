import { Component } from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { Module } from '../../models/module';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.css']
})
export class AddModuleComponent {
  // Liste de modules à ajouter
  modulesList: Module[] = [];
  
  // Module à ajouter
  newModule: Module = {
    title: '',
    description: '',
    trainingProgram: { id: 0 },
    pdfFilePath: '', // Ajout du champ PDF
  };

  // Compteur pour le nombre de modules ajoutés
  moduleCounter: number = 0;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private moduleService: ModuleService) {}

  // Méthode pour gérer l'upload du fichier PDF
  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Enregistrer le chemin du fichier PDF
        this.newModule.pdfFilePath = reader.result as string;
      };
      reader.readAsDataURL(file); // Lire le fichier sous forme de Data URL
    }
  }

  // Ajouter un module à la liste
  addModule(): void {
    console.log("Données envoyées au backend :", this.newModule); // 🔍 Debug

    // Validation des champs
    if (!this.newModule.title || !this.newModule.description || this.newModule.trainingProgram.id <= 0) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      this.successMessage = '';
      return;
    }

    // Ajout du module à la liste
    const moduleToAdd = {...this.newModule}; // Crée une copie du module actuel
    this.modulesList.push(moduleToAdd); // Ajoute la copie à la liste

    // Envoi des données au backend pour chaque module
    this.moduleService.createModule(moduleToAdd).subscribe({
      next: (data) => {
        console.log("Réponse du backend :", data); // 🔍 Debug
        this.successMessage = 'Module ajouté avec succès !';
        this.errorMessage = '';

        // Réinitialisation du formulaire après succès
        this.newModule = { title: '', description: '', trainingProgram: { id: 0 }, pdfFilePath: '' };
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error("Erreur du backend :", error);
        this.errorMessage = `Erreur lors de l’ajout du module: ${error.error.message || error.message}`;
        this.successMessage = '';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  // Méthode pour soumettre tous les modules à la fois si nécessaire
  submitAllModules(): void {
    this.modulesList.forEach(module => {
      this.moduleService.createModule(module).subscribe({
        next: (data) => {
          console.log("Réponse du backend pour module :", data);
        },
        error: (error) => {
          console.error("Erreur du backend pour module :", error);
        }
      });
    });
    // Affichage d'un message indiquant l'envoi de tous les modules
    this.successMessage = `${this.moduleCounter} modules ajoutés avec succès !`;
    this.moduleCounter = 0;  // Réinitialisation du compteur après soumission
    this.modulesList = [];    // Réinitialisation de la liste de modules
  }
}
