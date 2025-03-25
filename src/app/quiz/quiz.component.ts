import { Component, OnInit, OnDestroy } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { take } from "rxjs/operators";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"],
})
export class QuizComponent implements OnInit, OnDestroy {
  debugMessage = "Le composant Quiz est chargé";

  questions = [
    {
      question: "Quelle est la principale caractéristique de Big Data ?",
      options: ["Volume", "Vitesse", "Variété", "Les trois précédentes"],
      answer: "Les trois précédentes",
      explanation: "Big Data est défini par les 3 V : Volume, Vitesse, Variété.",
    },
    {
      question: "Quel est l'outil principal pour le traitement des données massives ?",
      options: ["Excel", "Hadoop", "MySQL", "Word"],
      answer: "Hadoop",
      explanation:
        "Hadoop est une plateforme open-source pour le traitement et le stockage de grandes quantités de données.",
    },
    {
      question: "Quelle est la méthode utilisée pour les prédictions en Data Science ?",
      options: ["Analyse de sentiments", "Apprentissage supervisé", "Cryptographie", "HTML"],
      answer: "Apprentissage supervisé",
      explanation:
        "L'apprentissage supervisé est utilisé pour entraîner des modèles à partir de données étiquetées afin de prédire des résultats.",
    },
    {
      question: "Qu'est-ce qu'un Data Lake ?",
      options: ["Un lac pour les données", "Un entrepôt de données brut", "Un logiciel de gestion", "Un langage de programmation"],
      answer: "Un entrepôt de données brut",
      explanation:
        "Un Data Lake est un stockage de données à grande échelle qui permet de stocker toutes sortes de données dans leur format brut.",
    },
    // Ajoute d'autres questions ici
  ];

  currentQuestionIndex = 0;
  score = 0;
  quizCompleted = false;
  timeLeft = 30; // 30 seconds per question
  timerSubscription: Subscription | null = null;
  progress = 0;
  showCongratulations = false;
  showAnswer = false;
  answerMessage = "";
  explanationMessage = "";

  ngOnInit() {
    console.log(this.debugMessage);
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timeLeft = 30;
    this.timerSubscription = interval(1000)
      .pipe(take(30))
      .subscribe(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.nextQuestion();
        }
      });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  answerQuestion(selectedAnswer: string): void {
    this.stopTimer();
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.showAnswer = true;
    if (selectedAnswer === currentQuestion.answer) {
      this.score++;
      this.answerMessage = "Correct !";
    } else {
      this.answerMessage = `Incorrect. La bonne réponse est: ${currentQuestion.answer}`;
    }
    this.explanationMessage = currentQuestion.explanation;
    setTimeout(() => this.nextQuestion(), 2000); // Wait for 2 seconds before moving to the next question
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.progress = (this.currentQuestionIndex / this.questions.length) * 100;
      this.startTimer();
      this.showAnswer = false;
      this.answerMessage = "";
      this.explanationMessage = "";
    } else {
      this.quizCompleted = true;
      this.progress = 100;
      this.showFinalScore();
    }
  }

  showFinalScore(): void {
    if (this.score === this.questions.length) {
      this.showCongratulations = true;
      setTimeout(() => (this.showCongratulations = false), 5000);
    }
  }

  restartQuiz(): void {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.quizCompleted = false;
    this.progress = 0;
    this.showCongratulations = false;
    this.showAnswer = false;
    this.answerMessage = "";
    this.explanationMessage = "";
    this.startTimer();
  }

  getCertificate(): string {
    const percentage = (this.score / this.questions.length) * 100;
    if (percentage === 100) {
      return "Félicitations ! Vous avez remporté le certificat avec un score parfait !";
    } else {
      return `Vous avez terminé le quiz avec un score de ${this.score}/${this.questions.length} (${percentage}%). Continuez à vous améliorer !`;
    }
  }
}
