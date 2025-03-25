import { Component, OnInit } from '@angular/core';
import { Content, ContentType } from 'src/app/models/content';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.css']
})
export class CreateContentComponent implements OnInit {
  newContent!: Content; // "!" permet d'éviter l'erreur TS
  contentTypes = Object.values(ContentType); // Liste des types de contenu
  successMessage = '';
  errorMessage = '';

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.resetForm(); // Initialisation correcte dans ngOnInit
  }

  addContent(): void {
    this.successMessage = '';
    this.errorMessage = '';

    // Vérification que moduleId est valide
    if (!this.newContent.moduleId) {
      this.errorMessage = '❌ Veuillez sélectionner un module valide.';
      return;
    }

    this.contentService.createContent(this.newContent).subscribe({
      next: (response) => {
        this.successMessage = '✅ Contenu ajouté avec succès !';
        console.log('✅ Réponse API :', response);
        this.resetForm(); // Réinitialisation après ajout
      },
      error: (error) => {
        this.errorMessage = `❌ Erreur lors de l'ajout du contenu : ${error.error?.message || error.message || 'Problème inconnu'}`;
        console.error('❌ Erreur API :', error);
      }
    });
  }

  private resetForm(): void {
    this.newContent = {
      contentType: ContentType.VIDEO, // Valeur par défaut
      contentUrl: '',
      duration: 1,
      moduleId: null // Mettre null au lieu de 0 pour éviter les erreurs
    };
  }
}
