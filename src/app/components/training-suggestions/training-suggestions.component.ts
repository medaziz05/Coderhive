import { Component, OnInit, Input } from '@angular/core';
import { SuggestionService } from '../../services/suggestion.service';
import { TrainingProgram } from 'src/app/models/trainingprogram';

@Component({
  selector: 'app-training-suggestions',
  templateUrl: './training-suggestions.component.html',
  styleUrls: ['./training-suggestions.component.css']
})
export class TrainingSuggestionsComponent implements OnInit {
  @Input() trainingProgramId!: number; // ID de la formation actuelle
  suggestions: TrainingProgram[] = [];

  constructor(private suggestionService: SuggestionService) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    if (!this.trainingProgramId) {
      console.warn("Aucun ID de formation fourni");
      return; // Évite les appels API inutiles si l'ID est vide
    }

    this.suggestionService.getSuggestions(this.trainingProgramId).subscribe(
      (data) => {
        this.suggestions = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des suggestions', error);
      }
    );
  }
}
