import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-google-recaptcha',
  imports: [],
  template: ` <p> google-recaptcha works! </p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleRecaptchaComponent {}
