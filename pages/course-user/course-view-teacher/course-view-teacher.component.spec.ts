import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseComponent } from './course-view-teacher.component';

describe('ViewCourseComponent', () => {
  let component: ViewCourseComponent;
  let fixture: ComponentFixture<ViewCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCourseComponent]
    });
    fixture = TestBed.createComponent(ViewCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
