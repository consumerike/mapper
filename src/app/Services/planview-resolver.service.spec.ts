import { TestBed, inject } from '@angular/core/testing';

import { PlanviewResolverService } from './planview-resolver.service';

describe('PlanviewResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanviewResolverService]
    });
  });

  it('should be created', inject([PlanviewResolverService], (service: PlanviewResolverService) => {
    expect(service).toBeTruthy();
  }));
});
