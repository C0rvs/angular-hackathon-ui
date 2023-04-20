import { TestBed } from '@angular/core/testing';

import { HscodesService } from './hscodes.service';

describe('HscodesService', () => {
  let service: HscodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HscodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
