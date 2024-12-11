import { TestBed } from '@angular/core/testing';

import { GoogleRecaptchaService } from './google-recaptcha.service';

describe('GoogleRecaptchaService', () => {
  let service: GoogleRecaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleRecaptchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
