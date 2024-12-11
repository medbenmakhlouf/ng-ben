import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleRecaptchaComponent } from './google-recaptcha.component';

describe('GoogleRecaptchaComponent', () => {
  let component: GoogleRecaptchaComponent;
  let fixture: ComponentFixture<GoogleRecaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleRecaptchaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleRecaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
