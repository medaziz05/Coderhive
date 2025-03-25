import { Component, OnInit } from '@angular/core';
import { Question } from '../models/question';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-questionlist',
  templateUrl: './questionlist.component.html',
  styleUrls: ['./questionlist.component.css']
})
export class QuestionListComponent implements OnInit {

  questions: Question[] = [];  // Déclarez correctement le type de données
  errorMessage: string = '';    // Déclarez une propriété pour afficher les erreurs

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.loadQuestions();  // Charge les questions lors de l'initialisation du composant
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: (data: Question[]) => {
        if (data && data.length > 0) {
          this.questions = data;  // Met à jour la liste des questions si elle est remplie
        } else {
          this.errorMessage = 'Aucune question disponible';  // Si aucune question n'est retournée
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération des questions';  // Message d'erreur en cas de problème
        console.error(err);  // Affiche l'erreur dans la console pour débogage
      }
    });
  }
}
