import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChapterTeacherComponent } from './view-chapter-teacher.component';

describe('ViewChapterTeacherComponent', () => {
  let component: ViewChapterTeacherComponent;
  let fixture: ComponentFixture<ViewChapterTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewChapterTeacherComponent],
    });
    fixture = TestBed.createComponent(ViewChapterTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
