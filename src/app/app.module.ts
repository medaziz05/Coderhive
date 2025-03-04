import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostComponent } from './components/post/post.component';
import { HackathonListComponent } from './components/hackathon-list/hackathon-list.component';
import { HackathonDetailComponent } from './components/hackathon-detail/hackathon-detail.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UpdatePostComponent } from './components/update-post/update-post.component';
import { CommonModule } from '@angular/common';
import { AdminPostListComponent } from './admin/admin-post-list/admin-post-list.component';
import { SharedModule } from './shared.module';
import { AdmincreateHackathonComponent } from './admin/admincreate-hackathon/admincreate-hackathon.component';
import { AdminHackathonListComponent } from './admin/admin-hackathon-list/admin-hackathon-list.component';
import { AdminupdateHackathonComponent } from './admin/adminupdate-hackathon/adminupdate-hackathon.component';

const routes: Routes = [
  // Gestion HACKATHON :
      // Coté Client :
      { path: 'hackathon_home_client', component: HackathonListComponent },             // HOME
      { path: 'hackathon_details_client/:id', component: HackathonDetailComponent },    // Détails
        // Coté Admin :
      { path: 'hackathon_home_admin', component: AdminHackathonListComponent, },        // HOME
      { path: 'hackathon_creer_admin', component: AdmincreateHackathonComponent },      // Créer
      { path: 'hackathon_modif_admin/:id', component: AdminupdateHackathonComponent },  // Modif
  



      
    { path: 'forums', component: PostListComponent }, // post list page
    { path: 'adminforums', component: AdminPostListComponent }, // post list page
    { path: 'forums/:id', component: PostComponent }, // post detail page
    { path: 'create-post', component: CreatePostComponent },
    { path: 'update-post/:id', component: UpdatePostComponent }, 
];

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostComponent,
    HackathonListComponent,
    CreatePostComponent,
    UpdatePostComponent,
    AdminPostListComponent,
    AdmincreateHackathonComponent,
    AdminHackathonListComponent,
    AdminupdateHackathonComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
