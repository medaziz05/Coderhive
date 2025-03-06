import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseUserComponent } from './view-course-user.component';

describe('ViewCourseUserComponent', () => {
  let component: ViewCourseUserComponent;
  let fixture: ComponentFixture<ViewCourseUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCourseUserComponent]
    });
    fixture = TestBed.createComponent(ViewCourseUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
