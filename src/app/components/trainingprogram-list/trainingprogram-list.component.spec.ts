import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingprogramListComponent } from './trainingprogram-list.component';

describe('TrainingprogramListComponent', () => {
  let component: TrainingprogramListComponent;
  let fixture: ComponentFixture<TrainingprogramListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingprogramListComponent]
    });
    fixture = TestBed.createComponent(TrainingprogramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
