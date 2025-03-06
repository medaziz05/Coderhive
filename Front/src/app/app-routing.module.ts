import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddfeedbackComponent } from './components/addfeedback/addfeedback.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ReclamationComponent } from './admin/reclamation/reclamation.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'addfeedback', component: AddfeedbackComponent },
  { path: 'admin', component : DashboardComponent },
  { path : 'reclamation' , component : ReclamationComponent},
  { path: 'user', component : HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
