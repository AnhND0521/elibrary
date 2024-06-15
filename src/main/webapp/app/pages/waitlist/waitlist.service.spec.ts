import { TestBed } from '@angular/core/testing';

import { WaitlistService } from './waitlist.service';

describe('WaitlistService', () => {
  let service: WaitlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaitlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
