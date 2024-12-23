import { type ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideGoogleAnalytic } from '@ng-ben/google-analytics';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideGoogleAnalytic({ trackingCode: 'UA-17886362-3' }, { include: ['/page-*'] }),
  ],
};
