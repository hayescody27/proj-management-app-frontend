import { TestBed } from '@angular/core/testing';

import { ProgressInterceptor } from './progress-interceptor.service';

describe('ProgressInterceptor', () => {
  let service: ProgressInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
