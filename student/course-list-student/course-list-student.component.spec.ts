import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListStudentComponent } from './course-list-student.component';

describe('CourseListStudentComponent', () => {
  let component: CourseListStudentComponent;
  let fixture: ComponentFixture<CourseListStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseListStudentComponent]
    });
    fixture = TestBed.createComponent(CourseListStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
