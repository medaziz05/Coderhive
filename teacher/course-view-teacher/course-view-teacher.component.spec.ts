import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseViewTeacherComponent } from './course-view-teacher.component';

describe('CourseViewTeacherComponent', () => {
  let component: CourseViewTeacherComponent;
  let fixture: ComponentFixture<CourseViewTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseViewTeacherComponent]
    });
    fixture = TestBed.createComponent(CourseViewTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
