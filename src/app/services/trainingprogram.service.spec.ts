import { TestBed } from '@angular/core/testing';

import { TrainingprogramService } from './trainingprogram.service';

describe('TrainingprogramService', () => {
  let service: TrainingprogramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingprogramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
