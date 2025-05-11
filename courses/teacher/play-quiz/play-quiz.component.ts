import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quiz, QuizDTO, QuizScoreSubmission } from '@app/courses/models/quiz.model';
import { ScoreDTO, ScoreSubmissionDTO } from '@app/courses/models/score.model';
import { QuizService } from '@app/courses/services/quiz.service';
import confetti from 'canvas-confetti';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, switchMap, tap } from 'rxjs';

interface QuizWithScores {
  quiz: QuizDTO;
  scores: ScoreDTO[];
}

@Component({
  selector: 'app-play-quiz',
  templateUrl: './play-quiz.component.html',
  styleUrls: ['./play-quiz.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class PlayQuizComponent implements OnInit {
  activeTab: string = 'play';
  quiz?: QuizDTO;
  category: string = '';
  successMessage: string = '';
  quizScores: ScoreDTO[] = [];
  currentQuestionIndex = 0;
  nextQuestionIsReady = false;
  isAnswerWrong = false;
  isAnswerCorrect = false;
  isLoading = true;
  showCountryDropdown = false;
  totalCorrect = 0;
  complete = false;
  nickname = '';
  showFeedback = false;
  feedbackMessage = '';
  quizPassed = false;
  quizResultTitle = '';
  quizResultMessage = '';
  private timerSubscription?: any;
  countdown = 3;
  selectedAnswer = '';
  correctAnswer = '';
 countdownInterval: any;
  requiredCorrect = 0;  
  totalQuestions: number = 0;  // Number of questions in the quiz
  countdownTime: number = 0;
  countdownDays: number = 7; 
private animationTime = 20;





  countries = [
    { code: 'af', name: 'Afghanistan' },
    { code: 'al', name: 'Albania' },
    { code: 'dz', name: 'Algeria' },
    { code: 'as', name: 'American Samoa' },
    { code: 'ad', name: 'Andorra' },
    { code: 'ao', name: 'Angola' },
    { code: 'ai', name: 'Anguilla' },
    { code: 'aq', name: 'Antarctica' },
    { code: 'ag', name: 'Antigua and Barbuda' },
    { code: 'ar', name: 'Argentina' },
    { code: 'am', name: 'Armenia' },
    { code: 'aw', name: 'Aruba' },
    { code: 'au', name: 'Australia' },
    { code: 'at', name: 'Austria' },
    { code: 'az', name: 'Azerbaijan' },
    { code: 'bs', name: 'Bahamas' },
    { code: 'bh', name: 'Bahrain' },
    { code: 'bd', name: 'Bangladesh' },
    { code: 'bb', name: 'Barbados' },
    { code: 'by', name: 'Belarus' },
    { code: 'be', name: 'Belgium' },
    { code: 'bz', name: 'Belize' },
    { code: 'bj', name: 'Benin' },
    { code: 'bm', name: 'Bermuda' },
    { code: 'bt', name: 'Bhutan' },
    { code: 'bo', name: 'Bolivia' },
    { code: 'ba', name: 'Bosnia and Herzegovina' },
    { code: 'bw', name: 'Botswana' },
    { code: 'br', name: 'Brazil' },
    { code: 'bn', name: 'Brunei' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'bf', name: 'Burkina Faso' },
    { code: 'bi', name: 'Burundi' },
    { code: 'cv', name: 'Cabo Verde' },
    { code: 'kh', name: 'Cambodia' },
    { code: 'cm', name: 'Cameroon' },
    { code: 'ca', name: 'Canada' },
    { code: 'ky', name: 'Cayman Islands' },
    { code: 'cf', name: 'Central African Republic' },
    { code: 'td', name: 'Chad' },
    { code: 'cl', name: 'Chile' },
    { code: 'cn', name: 'China' },
    { code: 'co', name: 'Colombia' },
    { code: 'km', name: 'Comoros' },
    { code: 'cd', name: 'Congo (Congo-Brazzaville)' },
    { code: 'cg', name: 'Congo (Congo-Kinshasa)' },
    { code: 'ck', name: 'Cook Islands' },
    { code: 'cr', name: 'Costa Rica' },
    { code: 'hr', name: 'Croatia' },
    { code: 'cu', name: 'Cuba' },
    { code: 'cy', name: 'Cyprus' },
    { code: 'cz', name: 'Czechia (Czech Republic)' },
    { code: 'dk', name: 'Denmark' },
    { code: 'dj', name: 'Djibouti' },
    { code: 'dm', name: 'Dominica' },
    { code: 'do', name: 'Dominican Republic' },
    { code: 'ec', name: 'Ecuador' },
    { code: 'eg', name: 'Egypt' },
    { code: 'sv', name: 'El Salvador' },
    { code: 'gq', name: 'Equatorial Guinea' },
    { code: 'er', name: 'Eritrea' },
    { code: 'ee', name: 'Estonia' },
    { code: 'sz', name: 'Eswatini (Swaziland)' },
    { code: 'et', name: 'Ethiopia' },
    { code: 'fj', name: 'Fiji' },
    { code: 'fi', name: 'Finland' },
    { code: 'fr', name: 'France' },
    { code: 'ga', name: 'Gabon' },
    { code: 'gm', name: 'Gambia' },
    { code: 'ge', name: 'Georgia' },
    { code: 'de', name: 'Germany' },
    { code: 'gh', name: 'Ghana' },
    { code: 'gr', name: 'Greece' },
    { code: 'gd', name: 'Grenada' },
    { code: 'gt', name: 'Guatemala' },
    { code: 'gn', name: 'Guinea' },
    { code: 'gw', name: 'Guinea-Bissau' },
    { code: 'gy', name: 'Guyana' },
    { code: 'ht', name: 'Haiti' },
    { code: 'hn', name: 'Honduras' },
    { code: 'hu', name: 'Hungary' },
    { code: 'is', name: 'Iceland' },
    { code: 'in', name: 'India' },
    { code: 'id', name: 'Indonesia' },
    { code: 'ir', name: 'Iran' },
    { code: 'iq', name: 'Iraq' },
    { code: 'ie', name: 'Ireland' },
    { code: 'il', name: 'Israel' },
    { code: 'it', name: 'Italy' },
    { code: 'jm', name: 'Jamaica' },
    { code: 'jp', name: 'Japan' },
    { code: 'jo', name: 'Jordan' },
    { code: 'kz', name: 'Kazakhstan' },
    { code: 'ke', name: 'Kenya' },
    { code: 'ki', name: 'Kiribati' },
    { code: 'kw', name: 'Kuwait' },
    { code: 'kg', name: 'Kyrgyzstan' },
    { code: 'la', name: 'Laos' },
    { code: 'lv', name: 'Latvia' },
    { code: 'lb', name: 'Lebanon' },
    { code: 'ls', name: 'Lesotho' },
    { code: 'lr', name: 'Liberia' },
    { code: 'ly', name: 'Libya' },
    { code: 'li', name: 'Liechtenstein' },
    { code: 'lt', name: 'Lithuania' },
    { code: 'lu', name: 'Luxembourg' },
    { code: 'mg', name: 'Madagascar' },
    { code: 'mw', name: 'Malawi' },
    { code: 'my', name: 'Malaysia' },
    { code: 'mv', name: 'Maldives' },
    { code: 'ml', name: 'Mali' },
    { code: 'mt', name: 'Malta' },
    { code: 'mh', name: 'Marshall Islands' },
    { code: 'mr', name: 'Mauritania' },
    { code: 'mu', name: 'Mauritius' },
    { code: 'mx', name: 'Mexico' },
    { code: 'fm', name: 'Micronesia' },
    { code: 'md', name: 'Moldova' },
    { code: 'mc', name: 'Monaco' },
    { code: 'mn', name: 'Mongolia' },
    { code: 'me', name: 'Montenegro' },
    { code: 'ma', name: 'Morocco' },
    { code: 'mz', name: 'Mozambique' },
    { code: 'mm', name: 'Myanmar (Burma)' },
    { code: 'na', name: 'Namibia' },
    { code: 'nr', name: 'Nauru' },
    { code: 'np', name: 'Nepal' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'nz', name: 'New Zealand' },
    { code: 'ni', name: 'Nicaragua' },
    { code: 'ne', name: 'Niger' },
    { code: 'ng', name: 'Nigeria' },
    { code: 'kp', name: 'North Korea' },
    { code: 'mk', name: 'North Macedonia' },
    { code: 'no', name: 'Norway' },
    { code: 'om', name: 'Oman' },
    { code: 'pk', name: 'Pakistan' },
    { code: 'pw', name: 'Palau' },
    { code: 'ps', name: 'Palestine' },
    { code: 'pa', name: 'Panama' },
    { code: 'pg', name: 'Papua New Guinea' },
    { code: 'py', name: 'Paraguay' },
    { code: 'pe', name: 'Peru' },
    { code: 'ph', name: 'Philippines' },
    { code: 'pl', name: 'Poland' },
    { code: 'pt', name: 'Portugal' },
    { code: 'qa', name: 'Qatar' },
    { code: 'ro', name: 'Romania' },
    { code: 'ru', name: 'Russia' },
    { code: 'rw', name: 'Rwanda' },
    { code: 'kn', name: 'Saint Kitts and Nevis' },
    { code: 'lc', name: 'Saint Lucia' },
    { code: 'vc', name: 'Saint Vincent and the Grenadines' },
    { code: 'ws', name: 'Samoa' },
    { code: 'sm', name: 'San Marino' },
    { code: 'st', name: 'São Tomé and Príncipe' },
    { code: 'sa', name: 'Saudi Arabia' },
    { code: 'sn', name: 'Senegal' },
    { code: 'rs', name: 'Serbia' },
    { code: 'sc', name: 'Seychelles' },
    { code: 'sl', name: 'Sierra Leone' },
    { code: 'sg', name: 'Singapore' },
    { code: 'sk', name: 'Slovakia' },
    { code: 'si', name: 'Slovenia' },
    { code: 'sb', name: 'Solomon Islands' },
    { code: 'so', name: 'Somalia' },
    { code: 'za', name: 'South Africa' },
    { code: 'kr', name: 'South Korea' },
    { code: 'ss', name: 'South Sudan' },
    { code: 'es', name: 'Spain' },
    { code: 'lk', name: 'Sri Lanka' },
    { code: 'sd', name: 'Sudan' },
    { code: 'sr', name: 'Suriname' },
    { code: 'se', name: 'Sweden' },
    { code: 'ch', name: 'Switzerland' },
    { code: 'sy', name: 'Syria' },
    { code: 'tw', name: 'Taiwan' },
    { code: 'tj', name: 'Tajikistan' },
    { code: 'tz', name: 'Tanzania' },
    { code: 'th', name: 'Thailand' },
    { code: 'tl', name: 'Timor-Leste' },
    { code: 'tg', name: 'Togo' },
    { code: 'to', name: 'Tonga' },
    { code: 'tt', name: 'Trinidad and Tobago' },
    { code: 'tn', name: 'Tunisia' },
    { code: 'tr', name: 'Turkey' },
    { code: 'tm', name: 'Turkmenistan' },
    { code: 'tv', name: 'Tuvalu' },
    { code: 'ug', name: 'Uganda' },
    { code: 'ua', name: 'Ukraine' },
    { code: 'ae', name: 'United Arab Emirates' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'us', name: 'United States' },
    { code: 'uy', name: 'Uruguay' },
    { code: 'uz', name: 'Uzbekistan' },
    { code: 'vu', name: 'Vanuatu' },
    { code: 'va', name: 'Vatican City' },
    { code: 've', name: 'Venezuela' },
    { code: 'vn', name: 'Vietnam' },
    { code: 'ye', name: 'Yemen' },
    { code: 'zm', name: 'Zambia' },
    { code: 'zw', name: 'Zimbabwe' },
  ];

  selectedCountry = this.countries[0].code;

  successMessages = [
    'You\'re killing it!',
    'No doubt about you mate!',
    'You are the master',
    'This is a walk in the park for you isn\'t it?',
    'Mate leave some for us',
    'Stunning!',
  ];

  wrongMessages = [
    'We will get them next time',
    'Even ChatGPT is better than you',
    'Do you need your mummy',
    'Come on you can do this!',
    'Never give up!',
    'Giving up is not an option',
  ];
  protected readonly document = document;

  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private quizService: QuizService) {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const quizId = Number(params.get('quizId'));
        if (isNaN(quizId)) throw new Error('Invalid quiz ID');
        return this.loadQuizWithScores(quizId);
      })
    ).subscribe({
      next: ({ quiz, scores }) => {
        this.quiz = quiz;
        this.isLoading = false;
        this.quizScores = scores || [];
        this.totalQuestions = quiz.questions.length; // Get the number of questions
        this.calculateCountdownTime(); // Adjust the countdown based on questions
        this.category = quiz.category;
        console.log('Quiz loaded:', quiz); // Add this to verify the data
      },
      error: err => {
        this.toastr.error('An error occurred while loading quiz and its scores', 'Error');
      },
    });
  }


  calculateCountdownTime() {
    if (this.totalQuestions <= 5) {
      this.countdownTime = 45;  // 45 seconds for 5 questions
      this.countdownDays = 1;
    } else if (this.totalQuestions <= 10) {
      this.countdownTime = 90;  // 1 minute 30 seconds for 10 questions
      this.countdownDays = 2;
    } else if (this.totalQuestions <= 15) {
      this.countdownTime = 120;  // 2 minutes for 15 questions
      this.countdownDays = 3;
    } else if (this.totalQuestions <= 20) {
      this.countdownTime = 150;  // 2 minutes 30 seconds for 20 questions
      this.countdownDays = 4;
    } else if (this.totalQuestions <= 25) {
      this.countdownTime = 180;  // 3 minutes for 25 questions
      this.countdownDays = 5;
    } else if (this.totalQuestions <= 30) {
      this.countdownTime = 210;  // 3 minutes 30 seconds for 30 questions
      this.countdownDays = 6;
    }

    this.startCountdownTimer(this.countdownTime);  // Start the countdown
  }



  
  setCountdownBasedOnQuestions() {
    if (this.totalQuestions === 5) {
      this.countdownTime = 45; // 45 seconds for 5 questions
    } else if (this.totalQuestions === 10) {
      this.countdownTime = 90; // 1 min 30 sec for 10 questions
    } else if (this.totalQuestions === 15) {
      this.countdownTime = 120; // 2 minutes for 15 questions
    } else if (this.totalQuestions === 20) {
      this.countdownTime = 150; // 2 min 30 sec for 20 questions
    } else if (this.totalQuestions === 25) {
      this.countdownTime = 180; // 3 minutes for 25 questions
    } else if (this.totalQuestions === 30) {
      this.countdownTime = 210; // 3 min 30 sec for 30 questions
    }

    // Start the countdown timer
    this.startCountdownTimer(this.countdownTime);
  }


  // Countdown Timer Logic
  startCountdownTimer(seconds: number) {
    let countdown = seconds;
    const interval = setInterval(() => {
      const minutes = Math.floor(countdown / 60);
      const remainingSeconds = countdown % 60;
      console.log(`Time Left: ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);

      if (countdown <= 0) {
        clearInterval(interval);
        console.log('Time is up!');
        // Handle what happens when the time runs out
      } else {
        countdown--;
      }
    }, 1000);
  }

  loadQuizWithScores(quizId: number): Observable<QuizWithScores> {
    return this.quizService.getQuiz(quizId).pipe(
      switchMap(quiz => {
        return this.quizService.getQuizScores(quiz.id).pipe(
          map(scores => ({
            quiz,
            scores: scores || []
          }))
        );
      })
    );
  }

  getQuizAnswersForCurrentQuestionSorted() {
    if (!this.quiz?.questions[this.currentQuestionIndex]?.answers) return [];
    return this.quiz.questions[this.currentQuestionIndex].answers
      .slice() // Create a copy to avoid mutating original array
      .sort((a, b) => a.answerLetter.localeCompare(b.answerLetter));
  }
  getCurrentQuestion(): string {
    if (!this.quiz || !this.quiz.questions) return '';
    return this.quiz.questions[this.currentQuestionIndex]?.question || '';
  }

  getCurrentQuestionCorrectAnswerLetter() {
    return this.quiz?.questions[this.currentQuestionIndex].correctAnswerLetter;
  }

  onAnswer(answerLetter: string) {
    if (!this.quiz || this.showFeedback) return;
  
    // Get current question safely
    const currentQuestion = this.quiz.questions[this.currentQuestionIndex];
    
    this.selectedAnswer = answerLetter;
    this.correctAnswer = currentQuestion.correctAnswerLetter;
    this.showFeedback = true;
    
  
    // Start countdown
    this.countdown = 3;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.moveToNextQuestion();
      }
    }, 1000);
  
    if (currentQuestion.correctAnswerLetter === answerLetter) {
      this.totalCorrect++;
      this.isAnswerCorrect = true;
      this.feedbackMessage = this.getRandomMessage(this.successMessages);
    } else {
      this.isAnswerWrong = true;
      this.feedbackMessage = `Wrong! Correct answer is ${currentQuestion.correctAnswerLetter}`;
    }
  
    this.timerSubscription = setTimeout(() => {
      this.moveToNextQuestion();
    }, 3000);
  }


  private moveToNextQuestion() {
    if (!this.quiz) return;

    this.showFeedback = false;
    this.isAnswerCorrect = false;
    this.isAnswerWrong = false;

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.completeQuiz();
    }
  }

  private completeQuiz() {
    this.complete = true;
    this.calculateQuizResult();
    
    // Only show confetti if passed
    if (this.quizPassed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }
  

  private calculateQuizResult() {
    if (!this.quiz) return;
  
    this.requiredCorrect = this.getRequiredCorrectAnswers();
    this.quizPassed = this.totalCorrect >= this.requiredCorrect;
  
    // Set result messages based on pass/fail
    if (this.quizPassed) {
      this.quizResultTitle = '🎉 Quiz Passed!';
      this.quizResultMessage = 'Great job! You demonstrated solid understanding of the material! 🎓';
      this.toastr.success(`Achieved ${this.totalCorrect}/${this.totalQuestions}`, 'Quiz Passed!');
    } else {
      this.quizResultTitle = '😢 Quiz Failed';
      this.quizResultMessage = 'Review the chapter and try again. Persistence leads to mastery! 💪';
      this.toastr.warning(`Needed ${this.requiredCorrect} correct answers (got ${this.totalCorrect})`, 'Keep Trying!');
    }
  }

  private getRequiredCorrectAnswers(): number {
    const total = this.totalQuestions;
    if (total <= 5) return 3;
    if (total <= 10) return 7;
    if (total <= 15) return 11;
    if (total <= 20) return 16;
    if (total <= 25) return 21;
    return 26;
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.totalCorrect = 0;
    this.complete = false;
    this.showFeedback = false;
    this.isLoading = true;
    this.ngOnInit();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      clearTimeout(this.timerSubscription);
    }
  }


  getRandomMessage(messages: string[]) {
    const randomIndex = Math.floor(Math.random() * messages.length);
    // Return the message at the random index
    return messages[randomIndex];
  }

  resetForNextQuestion() {
    this.isAnswerWrong = false;
    this.isAnswerCorrect = false;
    this.nextQuestionIsReady = false;
  }

  onNext() {
    if (!this.quiz) return;

    this.resetForNextQuestion();

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.complete = true;
    }
  }

  getSelectedCountry() {
    return this.countries.find((c: any) => c.code === this.selectedCountry)?.name;
  }

  onSubmitScore() {
    if (!this.quiz) return;

    const score: ScoreSubmissionDTO = {
      quizId: this.quiz.id,
      nickname: this.nickname,
      totalCorrect: this.totalCorrect,
      countryCode: this.selectedCountry
    };

    this.quizService.submitScore(score).pipe(
      tap(() => this.isLoading = true),
      switchMap(() => this.quizService.getQuizScores(this.quiz!.id))
    ).subscribe({
      next: (quizScores: ScoreDTO[]) => {
        this.setActiveTab('leaderboard');
        this.complete = false;
        this.quizScores = quizScores;
        this.isLoading = false;
        this.currentQuestionIndex = 0;
        this.totalCorrect = 0;
        this.resetForNextQuestion();
      },
      error: (err) => {
        this.toastr.error('Unable to submit your score', 'Error');
      }
    });
  }

  ngAfterViewInit() {
    // Reload deadline.js after view initialization
    const script = document.createElement('script');
    script.src = '/assets/js/deadline.js';
    document.body.appendChild(script);
  }

}

function initFlowbite(): void {
  console.log('Flowbite initialized');
}

