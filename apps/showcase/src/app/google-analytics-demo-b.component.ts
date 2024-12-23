import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-google-analytics-demo-b',
  imports: [RouterLink],
  template: `
    <p> test-page-b works! </p>
    <button [routerLink]="['/']">Back</button>
  `,
})
export class GoogleAnalyticsDemoBComponent {}
