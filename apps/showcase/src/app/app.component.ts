import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoogleAnalyticsDemoComponent } from './google-analytics-demo.component';
import { GoogleRecaptchaDemoComponent } from './google-recaptcha-demo.component';

@Component({
  selector: 'app-root',
  template: `
    <app-google-recaptcha-demo />
    <app-google-analytics-demo />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoogleRecaptchaDemoComponent, GoogleAnalyticsDemoComponent],
})
export class AppComponent {}
