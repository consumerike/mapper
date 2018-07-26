import { TestBed, inject } from '@angular/core/testing';

import { PerviewService } from './perview.service';

describe('PerviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerviewService]
    });
  });

  it('should be created', inject([PerviewService], (service: PerviewService) => {
    expect(service).toBeTruthy();
  }));
});
