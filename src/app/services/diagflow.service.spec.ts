import { TestBed } from '@angular/core/testing';

import { DiagflowService } from './diagflow.service';

describe('DiagflowService', () => {
  let service: DiagflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
