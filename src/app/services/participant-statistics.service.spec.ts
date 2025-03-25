import { TestBed } from '@angular/core/testing';

import { ParticipantStatisticsService } from './participant-statistics.service';

describe('ParticipantStatisticsService', () => {
  let service: ParticipantStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
