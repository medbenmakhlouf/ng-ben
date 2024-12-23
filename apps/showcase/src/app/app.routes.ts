import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'page-1',
    loadComponent: () => import('./google-analytics-demo-a.component').then((m) => m.GoogleAnalyticsDemoAComponent),
  },
  {
    path: 'page-2',
    loadComponent: () => import('./google-analytics-demo-b.component').then((m) => m.GoogleAnalyticsDemoBComponent),
  },
];
