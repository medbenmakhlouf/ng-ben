import type { GaActionEnum } from './enums';

/**
 * Provides an interface os a GA command list.
 */
export type DataLayer = (string | Record<string, string>)[];

/**
 * Google Analytics GTagFn call signature
 */
export type GtagFn = (...args: (string | Record<string, string>)[]) => object;
export type GaWindow = Window & {
  gtag?: any;
  dataLayer?: any;
};

/**
 * Standardizes a common command protocol :)
 */
export interface GoogleAnalyticsCommand {
  command: string;
  values: any[];
}

/**
 * Provide some custom settings for Automatics Router listener behaviour.
 */
export interface GoogleAnalyticsRoutingSettings {
  /**
   * Exclude the given path to the auto page-view trigger.
   *
   * ```ts
   *  providers: [
   *     ...
   *     provideGoogleAnalytic({ trackingCode: '*******' }, { exclude: ['/login', '/internal/*', /regExp/gi] }),
   *  ],
   * ```
   */
  exclude?: (string | RegExp)[];

  /**
   * Auto trigger page-view only for allowed uris.
   *
   * ```ts
   *  providers: [
   *     ...
   *     provideGoogleAnalytic({ trackingCode: '*******' }, { include: ['/login', '/internal/*', /regExp/gi] }),
   *  ],
   * ```
   */
  include?: (string | RegExp)[];
}

/**
 * Standardize an key-value objet to configure GA installation.
 */
export interface GoogleAnalyticsSettings {
  /** Is mandatory to provide a tracking code folks... */
  trackingCode: string;
  /** You can inject custom initialization commands like UserId or other e-commerce features. */
  initCommands?: GoogleAnalyticsCommand[];
  /** If Google changes the uri and I die, you can survive! */
  uri?: string;
  /** If true, trace GA tracking errors in production mode */
  enableTracing?: boolean;
  /** If has a value, nonce will be added to script tag */
  nonce?: string;
}

/**
 * @param {GaActionEnum | string} action 'video_auto_play_start'
 * @param {GoogleAnalyticEvent} [data] 'video_auto_play'
 * @param {string} [label] 'My promotional video'
 * @param {number} [value] A value to measure something
 * @param {boolean} [interaction] If user interaction is performed
 * @param {object} [options] - Additional options for the event
 */
export interface GoogleAnalyticEvent {
  action: GaActionEnum | string;
  category?: string;
  label?: string;
  value?: number;
  interaction?: boolean;
  options?: object;
}
