import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoogleRecaptchaDemoComponent } from './google-recaptcha-demo/google-recaptcha-demo.component';

@Component({
  selector: 'app-root',
  template: ` <app-google-recaptcha-demo /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoogleRecaptchaDemoComponent],
})
export class AppComponent {}
