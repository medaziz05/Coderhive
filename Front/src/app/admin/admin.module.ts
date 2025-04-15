import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ResponseComponent } from './response/response.component';
import { SearchComponent } from './search/search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TicketsComponent } from './tickets/tickets.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [ AdminLayoutComponent,  // Ajout du layout admin
    DashboardComponent, ReclamationComponent, ResponseComponent, SearchComponent, TicketsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatSnackBarModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatDividerModule,
    MatProgressBarModule,
    BrowserAnimationsModule,

    

  ],
  exports: [
    DashboardComponent  // Exportation pour l'utiliser ailleurs
  ]
})
export class AdminModule { }
