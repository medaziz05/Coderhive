import { TestBed } from '@angular/core/testing';

import { HackathonParticipationService } from './hackathon-participation.service';

describe('HackathonParticipationService', () => {
  let service: HackathonParticipationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HackathonParticipationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
