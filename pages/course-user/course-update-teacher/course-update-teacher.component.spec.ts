import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUpdateTeacherComponent } from './course-update-teacher.component';

describe('CourseUpdateTeacherComponent', () => {
  let component: CourseUpdateTeacherComponent;
  let fixture: ComponentFixture<CourseUpdateTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseUpdateTeacherComponent]
    });
    fixture = TestBed.createComponent(CourseUpdateTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
