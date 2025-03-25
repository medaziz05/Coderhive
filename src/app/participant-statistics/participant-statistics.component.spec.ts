import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantStatisticsComponent } from './participant-statistics.component';

describe('ParticipantStatisticsComponent', () => {
  let component: ParticipantStatisticsComponent;
  let fixture: ComponentFixture<ParticipantStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantStatisticsComponent]
    });
    fixture = TestBed.createComponent(ParticipantStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
