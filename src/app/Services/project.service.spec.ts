import { TestBed, inject } from '@angular/core/testing';

import { MyProjectService } from './project.service';

describe('ProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyProjectService]
    });
  });

  it('should be created', inject([MyProjectService], (service: MyProjectService) => {
    expect(service).toBeTruthy();
  }));
});
