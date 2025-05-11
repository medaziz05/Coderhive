import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBackpackTeacherComponent } from './add-backpack-teacher.component';

describe('AddBackpackTeacherComponent', () => {
  let component: AddBackpackTeacherComponent;
  let fixture: ComponentFixture<AddBackpackTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBackpackTeacherComponent]
    });
    fixture = TestBed.createComponent(AddBackpackTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
