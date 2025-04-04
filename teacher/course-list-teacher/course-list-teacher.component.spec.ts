import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListTeacherComponent } from './course-list-teacher.component';

describe('CourseListTeacherComponent', () => {
  let component: CourseListTeacherComponent;
  let fixture: ComponentFixture<CourseListTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseListTeacherComponent]
    });
    fixture = TestBed.createComponent(CourseListTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
