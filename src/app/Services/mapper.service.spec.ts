import { TestBed, inject } from '@angular/core/testing';

import { MapperService } from './mapper.service';

describe('MapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapperService]
    });
  });

  it('should be created', inject([MapperService], (service: MapperService) => {
    expect(service).toBeTruthy();
  }));
});
