import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-google-analytics-demo-a',
  imports: [RouterLink],
  template: `
    <p> test-page-a works! </p>
    <button [routerLink]="['/']">Back</button>
  `,
})
export class GoogleAnalyticsDemoAComponent {}
