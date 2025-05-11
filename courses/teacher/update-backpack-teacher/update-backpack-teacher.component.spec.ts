import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBackpackTeacherComponent } from './update-backpack-teacher.component';

describe('UpdateBackpackTeacherComponent', () => {
  let component: UpdateBackpackTeacherComponent;
  let fixture: ComponentFixture<UpdateBackpackTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBackpackTeacherComponent]
    });
    fixture = TestBed.createComponent(UpdateBackpackTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
