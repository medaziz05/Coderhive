import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './templates/header/header.component';
import { FooterComponent } from './templates/footer/footer.component';
import { UserHomeComponent } from './templates/home/home.component';

// Teacher Components
import { AddCourseComponent } from './courses/teacher/add-course/add-course.component';
import { CourseListTeacherComponent } from './courses/teacher/course-list-teacher/course-list-teacher.component';
import { CourseViewTeacherComponent } from './courses/teacher/course-view-teacher/course-view-teacher.component';
import { AddChapterComponent } from './courses/teacher/add-chapter/add-chapter.component';
import { UpdateCourseTeacherComponent } from './courses/teacher/update-course-teacher/update-course-teacher.component';
import { ViewChapterTeacherComponent } from './courses/teacher/view-chapter-teacher/view-chapter-teacher.component';
import { ProfileTeacherComponent } from './courses/teacher/profile-teacher/profile-teacher.component';

// Student Components
import { CourseListStudentComponent } from './courses/student/course-list-student/course-list-student.component';
import { CourseViewStudentComponent } from './courses/student/course-view-student/course-view-student.component';

// Routing

// Services
import { CourseService } from './courses/services/course.service';
import { AppRoutingModule } from './app-routing.module';
import { SafeHtmlPipe } from './safe-html.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateChapterComponent } from './courses/teacher/update-chapter/update-chapter.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserHomeComponent,
    
    AddCourseComponent,
    CourseListTeacherComponent,
    CourseViewTeacherComponent,
    AddChapterComponent,
    UpdateCourseTeacherComponent,
    ViewChapterTeacherComponent,
    ProfileTeacherComponent,
    CourseListStudentComponent,
    CourseViewStudentComponent,
    UpdateChapterComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule ,
    SwiperModule
  ],
  providers: [CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }