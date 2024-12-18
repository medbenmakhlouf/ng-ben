import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecaptchaDirective } from './recaptcha.directive';

@Component({
  selector: 'google-recaptcha',
  template: ``,
  hostDirectives: [
    {
      directive: RecaptchaDirective,
      inputs: ['badge', 'size', 'theme', 'type', 'siteKey', 'id', 'errorMode', 'tabIndex'],
      outputs: ['errored', 'resolved'],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecaptchaComponent {}
