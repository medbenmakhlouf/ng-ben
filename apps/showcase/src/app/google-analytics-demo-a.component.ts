import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-google-analytics-demo-a',
  imports: [RouterLink],
  template: `
    <p> test-page-a works! </p>
    <button [routerLink]="['/']">Back</button>
  `,
})
export class GoogleAnalyticsDemoAComponent {}
