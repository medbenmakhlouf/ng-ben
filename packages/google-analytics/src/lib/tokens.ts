import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { type IGoogleAnalyticsRoutingSettings } from './interfaces/i-google-analytics-routing-settings';
import type { DataLayer, GaWindow } from './types';

/**
 * Check if there is some global function called gtag on Window object, or create an empty function to doesn't brake codes...
 * @param window
 */
export function getDataLayerFn(window: GaWindow): DataLayer {
  return window ? (window['dataLayer'] = window['dataLayer'] || []) : null;
}

/**
 * Provide DOM Window reference.
 */
export const NGX_WINDOW = new InjectionToken<GaWindow>('ngx-window', {
  providedIn: 'root',
  factory: () => {
    const { defaultView } = inject(DOCUMENT);

    if (!defaultView) {
      throw new Error('Window is not available');
    }

    return defaultView;
  },
});

/**
 * Provides an injection token to access Google Analytics DataLayer Collection
 */
export const NGX_DATA_LAYER = new InjectionToken<DataLayer>('ngx-data-layer', {
  providedIn: 'root',
  factory: () => getDataLayerFn(inject(NGX_WINDOW)),
});
/**
 * Provide a Injection Token to global settings.
 */
export const NGX_GOOGLE_ANALYTICS_ROUTING_SETTINGS_TOKEN = new InjectionToken<IGoogleAnalyticsRoutingSettings>(
  'ngx-google-analytics-routing-settings',
  {
    factory: () => ({}),
  },
);
