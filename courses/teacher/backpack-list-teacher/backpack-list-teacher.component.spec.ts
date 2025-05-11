import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackpackListTeacherComponent } from './backpack-list-teacher.component';

describe('BackpackListTeacherComponent', () => {
  let component: BackpackListTeacherComponent;
  let fixture: ComponentFixture<BackpackListTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackpackListTeacherComponent]
    });
    fixture = TestBed.createComponent(BackpackListTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
