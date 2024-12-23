import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GoogleAnalyticsDirective } from '@ng-ben/google-analytics';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-google-analytics-demo',
  imports: [RouterOutlet, RouterLink, GoogleAnalyticsDirective],
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center">
      <h1> Welcome to Google Analytics Demo! </h1>

      <nav>
        <ul>
          <li><a [routerLink]="['/page-1']">Page 1</a></li>
          <li><a [routerLink]="['/page-2']">Page 2</a></li>
        </ul>
      </nav>

      <router-outlet></router-outlet>

      <hr />
      <h2>Directive tests</h2>

      <div>
        <button google-analytics gaCategory="ga_directive_test" gaAction="click_test">Click Test</button>
        <button google-analytics gaCategory="ga_directive_test" gaAction="focus_test" gaBind="focus">Focus Test</button>
        <button google-analytics gaCategory="ga_directive_test" gaAction="blur_test" gaBind="blur">Blur Test</button>
      </div>

      <div>
        <input
          google-analytics
          gaCategory="ga_directive_input_test"
          gaAction="fill_blur"
          placeholder="Auto Blur Test"
        />
      </div>

      <h2>Group Directive Test</h2>

      <div google-analytics gaCategory="ga_test_category">
        <button google-analytics gaAction="click_test">Click Test</button>
        <button google-analytics gaAction="focus_test" gaBind="focus">Focus Test</button>
        <button google-analytics gaAction="blur_test" gaBind="blur">Blur Test</button>
      </div>
    </div>
  `,
})
export class GoogleAnalyticsDemoComponent {}
