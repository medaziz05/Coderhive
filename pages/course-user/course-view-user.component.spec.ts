import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUserComponent } from './course-view-user.component';

describe('CourseUserComponent', () => {
  let component: CourseUserComponent;
  let fixture: ComponentFixture<CourseUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseUserComponent]
    });
    fixture = TestBed.createComponent(CourseUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
