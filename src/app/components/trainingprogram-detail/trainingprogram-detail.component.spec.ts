import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingprogramDetailComponent } from './trainingprogram-detail.component';

describe('TrainingprogramDetailComponent', () => {
  let component: TrainingprogramDetailComponent;
  let fixture: ComponentFixture<TrainingprogramDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingprogramDetailComponent]
    });
    fixture = TestBed.createComponent(TrainingprogramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
