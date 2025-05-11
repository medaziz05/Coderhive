import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChapterStudentComponent } from './view-chapter-student.component';

describe('ViewChapterTeacherComponent', () => {
  let component: ViewChapterStudentComponent;
  let fixture: ComponentFixture<ViewChapterStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewChapterStudentComponent],
    });
    fixture = TestBed.createComponent(ViewChapterStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
