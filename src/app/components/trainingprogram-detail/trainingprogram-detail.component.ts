import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingProgram } from 'src/app/models/trainingprogram';
import { TrainingprogramService } from 'src/app/services/trainingprogram.service';
import { QuizComponent } from './../../quiz/quiz.component';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-trainingprogram-detail',
  templateUrl: './trainingprogram-detail.component.html',
  styleUrls: ['./trainingprogram-detail.component.css'],
})
export class TrainingprogramDetailComponent implements OnInit, OnDestroy {
  trainingProgram: TrainingProgram | null = null;
  id!: number;

  timer: number = 60; // Temps en secondes
  timerInterval: any;
  completedTrainings: number[] = []; // 🔥 Liste des formations suivies

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingprogramService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.id = id;
        this.loadTrainingProgram(id);
        this.startTimer(); // ⏳ Démarrer le chronomètre
        this.loadCompletedTrainings(); // ✅ Charger l'historique des formations suivies
      }
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
        alert("⏳ Temps écoulé !");
        this.markTrainingAsCompleted(); // ✅ Enregistrer la formation comme complétée
        this.recommendTraining(); // 🔥 Recommander un autre programme
      }
    }, 1000);
  }

  goToPayment() {
    if (this.trainingProgram && this.trainingProgram.id) {
      this.router.navigate(['/payment', this.trainingProgram.id]);
    } else {
      console.error("ID du programme de formation non défini !");
    }
  }

  quizQuestions = [
    {
      question: 'Qu\'est-ce que le Big Data ?',
      options: ['Analyse des données', 'Gestion des bases de données', 'Machine Learning'],
      correctAnswer: 'Analyse des données'
    },
    {
      question: 'Quel est l\'objectif de l\'Intelligence Artificielle ?',
      options: ['Améliorer la prise de décision', 'Créer des graphiques', 'Apprendre à programmer'],
      correctAnswer: 'Améliorer la prise de décision'
    }
  ];

  loadTrainingProgram(id: number): void {
    this.trainingService.getTrainingProgramById(id).subscribe(
      (data) => {
        this.trainingProgram = data;
      },
      (error) => {
        console.error('Error fetching training program details:', error);
      }
    );
  }

  loadCompletedTrainings(): void {
    const storedTrainings = localStorage.getItem('completedTrainings');
    if (storedTrainings) {
      this.completedTrainings = JSON.parse(storedTrainings);
    }
  }

  markTrainingAsCompleted(): void {
    if (!this.completedTrainings.includes(this.id)) {
      this.completedTrainings.push(this.id);
      localStorage.setItem('completedTrainings', JSON.stringify(this.completedTrainings));
    }
  }

  recommendTraining(): void {
    const allTrainings = [
      { id: 1, name: "Formation en Big Data" },
      { id: 2, name: "Formation en Intelligence Artificielle" },
      { id: 3, name: "Formation en Cloud Computing" },
      { id: 4, name: "Formation en Développement Web" },
      { id: 5, name: "Formation en Cybersécurité" }
    ];

    // 🔥 Filtrer les formations déjà suivies
    const availableTrainings = allTrainings.filter(training => !this.completedTrainings.includes(training.id));

    if (availableTrainings.length > 0) {
      const recommendedTraining = availableTrainings[Math.floor(Math.random() * availableTrainings.length)];
      alert(`📢 Recommandation : Essayez "${recommendedTraining.name}" !`);
    } else {
      alert("✅ Vous avez déjà complété toutes les formations disponibles !");
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval); // Arrêter le timer si l'utilisateur quitte la page
    }
  }
}
