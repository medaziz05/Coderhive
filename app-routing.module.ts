import { RouterModule, Routes } from "@angular/router";
import { UserHomeComponent } from "./templates/home/home.component";
import { CourseViewTeacherComponent } from "./courses/teacher/course-view-teacher/course-view-teacher.component";
import { AddCourseComponent } from "./courses/teacher/add-course/add-course.component";
import { AddChapterComponent } from "./courses/teacher/add-chapter/add-chapter.component";
import { UpdateCourseTeacherComponent } from "./courses/teacher/update-course-teacher/update-course-teacher.component";
import { NgModule } from "@angular/core";
import { CourseListTeacherComponent } from "./courses/teacher/course-list-teacher/course-list-teacher.component";
import { CourseListStudentComponent } from "./courses/student/course-list-student/course-list-student.component";
import { CourseViewStudentComponent } from "./courses/student/course-view-student/course-view-student.component";
import { ProfileTeacherComponent } from "./courses/teacher/profile-teacher/profile-teacher.component";
import { ViewChapterTeacherComponent } from "./courses/teacher/view-chapter-teacher/view-chapter-teacher.component";
import { UpdateChapterComponent } from "./courses/teacher/update-chapter/update-chapter.component";

const routes: Routes = [
  { path: '', component: UserHomeComponent },
  { 
    path: 'teacher',
    children: [
      { path: 'courses', component: CourseListTeacherComponent },
      { path: 'add-course', component: AddCourseComponent },
      { 
        path: 'courses/:courseId', component: CourseViewTeacherComponent, // Teacher's course view
      },
      { 
        path: 'courses/:courseId/edit', component: UpdateCourseTeacherComponent,  // Edit course route for teacher
      },
      { 
        path: 'courses/:courseId/add-chapter', component: AddChapterComponent // Add chapter route for teacher
      },
      { 
        path: 'profile', component: ProfileTeacherComponent  // Route for profile page
      },
      { 
        path: 'courses/:courseId/chapters/:chapterId', component: ViewChapterTeacherComponent },
        { 
          path: 'courses/:courseId/chapters/:chapterId/update', 
          component: UpdateChapterComponent 
        }
    ]
  },
  { 
    path: 'student',  // Define path for the student section
    children: [
      { path: 'courses', component: CourseListStudentComponent }, // List courses for student
      { path: 'courses/:courseId', component: CourseViewStudentComponent }, // View course details for student
    ]
  },
  { path: '**', redirectTo: '/student/courses' } // Default redirect for student courses
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
