import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddfeedbackComponent } from './components/addfeedback/addfeedback.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ReclamationComponent } from './admin/reclamation/reclamation.component';
import { TicketListComponent } from './components/ticket/ticket-list/ticket-list.component';
import { TicketCreateComponent } from './components/ticket/ticket-create/ticket-create.component';
import { TicketDetailComponent } from './components/ticket/ticket-detail/ticket-detail.component';
import { ConversationComponent } from './components/ticket/conversation/conversation.component';
import { TicketsComponent } from '../app/admin/tickets/tickets.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'addfeedback', component: AddfeedbackComponent },
  { path: 'admin', component: DashboardComponent },
  { path: 'reclamation', component: ReclamationComponent },
  { path: 'user', component: HomeComponent },
  // Ticket routes
  { path: 'tickets', component: TicketListComponent },
  { path: 'tickets/create', component: TicketCreateComponent },
  { path: 'tickets/:id', component: TicketDetailComponent },
  { path: 'conversation/:id', component: ConversationComponent },
  { path: 'admintickets', component: TicketsComponent },
  
  
  // Wildcard route should be LAST
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
