import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListUserComponent } from './course-list-user.component';

describe('CourseListUserComponent', () => {
  let component: CourseListUserComponent;
  let fixture: ComponentFixture<CourseListUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseListUserComponent]
    });
    fixture = TestBed.createComponent(CourseListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
