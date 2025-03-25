import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TrainingProgramListComponent } from './components/trainingprogram-list/trainingprogram-list.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TrainingprogramDetailComponent } from './components/trainingprogram-detail/trainingprogram-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CreateTrainingComponent } from './admin/create-training/create-training.component';
import { UpdateTrainingComponent } from './admin/update-training/update-training.component';
import { ParticipantListComponent } from './admin/participant-list/participant-list.component';
import { ModuleListComponent } from './components/module-list/module-list.component';
import { AddModuleComponent } from './components/add-module/add-module.component';
import { CreateContentComponent } from './create-content/create-content.component';
import { QuestionListComponent } from './questionlist/questionlist.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ParticipantStatisticsComponent } from './participant-statistics/participant-statistics.component';
//import { TrainingProgramListComponent } from './admin/training-program-list/training-program-list.component';
import { TrainingSuggestionsComponent } from './components/training-suggestions/training-suggestions.component';
import { PaymentComponent } from './components/payment/payment.component';

import { NgxStripeModule } from 'ngx-stripe';

import { SuccessComponent } from './success/success.component';
import { ChatComponent } from './chat/chat.component';

import { QuizComponent } from './quiz/quiz.component';
import { StatisticssComponent } from './statisticss/statisticss.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { PresenceScannerComponent } from './presence-scanner/presence-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SimulatedLoginComponent } from './simulated-login/simulated-login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { EmailLoginComponent } from './email-login/email-login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'training', component: TrainingProgramListComponent },
  { path: 'training/:id', component: TrainingprogramDetailComponent },
  { path: 'create-training', component: CreateTrainingComponent },
  { path: 'update-training/:id', component: UpdateTrainingComponent },
  { path: 'listtraining', component: TrainingProgramListComponent },
  { path: 'addmodule', component: AddModuleComponent },
  { path: 'participants', component: ParticipantListComponent },
  { path: 'modules', component: ModuleListComponent },
  { path: 'contents', component: CreateContentComponent },
  { path: 'questionlist', component: QuestionListComponent },
  { path: 'add', component: AddQuestionComponent },
  { path: 'statistics', component: ParticipantStatisticsComponent },
  { path: 'suggestions', component: TrainingSuggestionsComponent },
  { path: 'payment/:trainingProgramId', component: PaymentComponent },
  { path: 'succes', component: SuccessComponent },
  {path:'listparticipant',component:ParticipantListComponent},
  {path:'chat',component:ChatComponent},
  {path:'list',component:TrainingProgramListComponent},
  {path:'statisticss',component:StatisticssComponent},
  {path:'recommendation',component:RecommendationComponent},
  { path: 'signup', component: SignupComponent },

  
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    TrainingProgramListComponent,
    TrainingprogramDetailComponent,
    NavbarComponent,
    FooterComponent,
    CreateTrainingComponent,
    UpdateTrainingComponent,
    ParticipantListComponent,
    ModuleListComponent,
    AddModuleComponent,
    CreateContentComponent,
    QuestionListComponent,
    AddQuestionComponent,
    ParticipantStatisticsComponent,
  
    TrainingSuggestionsComponent,
    PaymentComponent,
    SuccessComponent,
    ChatComponent,
 
    QuizComponent,
      StatisticssComponent,
      RecommendationComponent,
      PresenceScannerComponent,
      SimulatedLoginComponent,
      UserDashboardComponent,
      EmailLoginComponent,
      SignupComponent,
  ],
  imports: [
 
  BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule,
    CommonModule,
    ZXingScannerModule,
     
   
    NgxStripeModule.forRoot('pk_test_51QwnLFP4qxpDybqGNuWg4hQ5PYpKt5cYeiNJ75pX858bUz4T8xJRdyZhwp5jcgAnLLONgMRBIr1tA2vSxV7SfjMr000d6DpRS0'), // Remplace par ta clé Stripe
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
