import { TestBed } from '@angular/core/testing';

import { FebackService } from './feback.service';

describe('FebackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FebackService = TestBed.get(FebackService);
    expect(service).toBeTruthy();
  });
});
