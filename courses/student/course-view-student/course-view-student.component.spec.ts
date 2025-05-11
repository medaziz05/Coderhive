import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseViewStudentComponent } from './course-view-student.component';

describe('CourseViewStudentComponent', () => {
  let component: CourseViewStudentComponent;
  let fixture: ComponentFixture<CourseViewStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseViewStudentComponent],
    });
    fixture = TestBed.createComponent(CourseViewStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
