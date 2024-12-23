import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import type { DataLayer, GaWindow, GtagFn, GoogleAnalyticsRoutingSettings, GoogleAnalyticsSettings } from './types';

/**
 * Check if there is some global function called gtag on Window object, or create an empty function to doesn't brake codes.
 * @param {GaWindow} window - The window object to check for the gtag function.
 * @returns {DataLayer} The dataLayer array from the window object.
 */
function getDataLayerFn(window: GaWindow): DataLayer {
  return window ? (window['dataLayer'] = window['dataLayer'] || []) : null;
}

/**
 * Check if there is some global function called gtag on Window object, or create an empty function to doesn't brake codes.
 * @param {GaWindow} window - The window object to check for the gtag function.
 * @returns {GtagFn} The gtag function from the window object.
 */
function getGtagFn(window: GaWindow): GtagFn {
  const dataLayer: DataLayer = getDataLayerFn(window);
  return window
    ? (window['gtag'] =
        window['gtag'] ||
        function () {
          // eslint-disable-next-line prefer-rest-params
          dataLayer.push(arguments as any);
        })
    : null;
}

/**
 * Provides an injection token to access Google Analytics Gtag Function
 */
export const GTAG_FN = new InjectionToken<GtagFn>('gtag-fn', {
  providedIn: 'root',
  factory: () => {
    const { defaultView } = inject(DOCUMENT);
    if (!defaultView) {
      throw new Error('Window is not available');
    }
    return getGtagFn(defaultView);
  },
});

/**
 * Provide a Injection Token to router settings.
 */
export const ROUTING_SETTINGS = new InjectionToken<GoogleAnalyticsRoutingSettings>('routing-settings');

/**
 * Provide a Injection Token to global settings.
 */
export const GLOBAL_SETTINGS = new InjectionToken<GoogleAnalyticsSettings>('analytics-settings', {
  factory: () => ({ trackingCode: '', enableTracing: false }),
});
