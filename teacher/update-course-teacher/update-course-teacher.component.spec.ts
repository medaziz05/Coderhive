import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCourseTeacherComponent } from './update-course-teacher.component';

describe('UpdateCourseTeacherComponent', () => {
  let component: UpdateCourseTeacherComponent;
  let fixture: ComponentFixture<UpdateCourseTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCourseTeacherComponent]
    });
    fixture = TestBed.createComponent(UpdateCourseTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
