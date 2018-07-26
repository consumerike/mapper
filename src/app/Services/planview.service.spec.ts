import { TestBed, inject } from '@angular/core/testing';

import { PlanviewService } from './planview.service';

describe('PlanviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanviewService]
    });
  });

  it('should be created', inject([PlanviewService], (service: PlanviewService) => {
    expect(service).toBeTruthy();
  }));
});
