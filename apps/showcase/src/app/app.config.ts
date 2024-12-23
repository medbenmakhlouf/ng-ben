import { type ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from '@ng-ben/google-analytics';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      NgxGoogleAnalyticsModule.forRoot('UA-17886362-3'),
      NgxGoogleAnalyticsRouterModule.forRoot({ include: ['/page-*'] }),
    ),
  ],
};
