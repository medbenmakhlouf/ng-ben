import {inject, InjectionToken} from '@angular/core';
import type {GaWindow} from './tokens/ngx-google-analytics-window';
import {NGX_WINDOW} from './tokens/ngx-window-token';
import type {DataLayer} from './types';

/**
 * Check if there is some global function called gtag on Window object, or create an empty function to doesn't brake codes...
 * @param window
 */
export function getDataLayerFn(window: GaWindow): DataLayer {
  return window ? (window['dataLayer'] = window['dataLayer'] || []) : null;
}

/**
 * Provides an injection token to access Google Analytics DataLayer Collection
 */
export const NGX_DATA_LAYER = new InjectionToken<DataLayer>('ngx-data-layer', {
  providedIn: 'root',
  factory: () => getDataLayerFn(inject(NGX_WINDOW)),
});
