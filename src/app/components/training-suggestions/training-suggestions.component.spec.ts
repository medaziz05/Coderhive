import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSuggestionsComponent } from './training-suggestions.component';

describe('TrainingSuggestionsComponent', () => {
  let component: TrainingSuggestionsComponent;
  let fixture: ComponentFixture<TrainingSuggestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingSuggestionsComponent]
    });
    fixture = TestBed.createComponent(TrainingSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
