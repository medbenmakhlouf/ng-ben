import { Injectable, isDevMode, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN, NGX_GTAG_FN } from './tokens';
import { type GtagFn, type GoogleAnalyticsSettings, type GoogleAnalyticEvent } from './types';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private readonly settings = inject<GoogleAnalyticsSettings>(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN);
  private readonly _document = inject(DOCUMENT);
  private readonly _gtag = inject<GtagFn>(NGX_GTAG_FN);

  private get document(): Document {
    return this._document;
  }

  private throw(err: Error) {
    if ((this.settings.enableTracing || isDevMode()) && console && console.error) {
      console.error(err);
    }
  }

  /**
   * Converts a Map to a key-value object.
   * @param {Map<string, any>} map - The map to convert.
   * @returns {Record<string, any> | void} The converted key-value object or undefined if the map is empty.
   * @todo Change this to `Object.fromEntity()` in the future...
   */
  private toKeyValue(map: Map<string, any>): Record<string, any> | void {
    return map.size > 0
      ? Array.from(map).reduce((obj, [key, value]) => Object.defineProperty(obj, key, { value, enumerable: true }), {})
      : undefined;
  }

  /**
   * Call native GA Tag
   * @param {...any} args - The arguments to pass to the GA Tag function.
   */
  gtag(...args: any[]) {
    try {
      this._gtag(...args.filter((x) => x !== undefined));
    } catch (err: any) {
      this.throw(err);
    }
  }

  /**
   * Send an event trigger to GA. It is the same as call:
   * ```js
   * gtag('event', 'video_auto_play_start', {
   * 'event_label': 'My promotional video',
   * 'event_category': 'video_auto_play'
   * });
   * ```
   * @param {GoogleAnalyticEvent} [data] event data
   */
  event(data: GoogleAnalyticEvent) {
    try {
      const opt = new Map<string, any>();
      if (data.category) {
        opt.set('event_category', data.category);
      }
      if (data.label) {
        opt.set('event_label', data.label);
      }
      if (data.value) {
        opt.set('value', data.value);
      }
      if (data.interaction !== undefined) {
        opt.set('interaction', data.interaction);
      }
      if (data.options) {
        Object.entries(data.options).map(([key, value]) => opt.set(key, value));
      }
      const params = this.toKeyValue(opt);
      if (params) {
        this.gtag('event', data.action as string, params);
      } else {
        this.gtag('event', data.action as string);
      }
    } catch (error: any) {
      this.throw(error);
    }
  }

  /**
   * Send an page view event. This is the same as
   *
   * ```js
   * gtag('config', 'GA_TRACKING_ID', {
   * 'page_title' : 'Homepage',
   * 'page_path': '/home'
   * });
   * ```
   *
   * The tracking ID is injected automatically by Inject Token NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN
   * @param {string} path - /home
   * @param {string} [title] - Homepage
   * @param {string} [location] - '{ page_location }'
   * @param {object} [options] - '{ ... custom dimensions }'
   */
  pageView(path: string, title?: string, location?: string, options?: object) {
    try {
      const opt = new Map<string, any>([['page_path', path]]);
      if (title) {
        opt.set('page_title', title);
      }
      if (location || this.document) {
        opt.set('page_location', location || this.document.location.href);
      }
      if (options) {
        Object.entries(options).map(([key, value]) => opt.set(key, value));
      }
      this.gtag('config', this.settings.trackingCode, this.toKeyValue(opt));
    } catch (error: any) {
      this.throw(error);
    }
  }

  /**
   * Send an event to report a App Page View. It is the same as
   *
   * ```js
   * gtag('event', 'screen_view', {
   * 'app_name': 'myAppName',
   * 'screen_name' : 'Home'
   * });
   *
   * ```
   * @param {string} screen - 'screen_name'
   * @param {string} appName - 'app_name'
   * @param {string} [appId] - 'app_id'
   * @param {string} [appVersion] - 'app_version'
   * @param {string} [installerId] - 'app_installer_id'
   */
  appView(screen: string, appName: string, appId?: string, appVersion?: string, installerId?: string) {
    try {
      const opt = new Map<string, any>([
        ['screen_name', screen],
        ['app_name', appName],
      ]);
      if (appId) {
        opt.set('app_id', appId);
      }
      if (appVersion) {
        opt.set('app_version', appVersion);
      }
      if (installerId) {
        opt.set('app_installer_id', installerId);
      }
      this.gtag('event', 'screen_view', this.toKeyValue(opt));
    } catch (error: any) {
      this.throw(error);
    }
  }

  /**
   * Defines persistent values on GoogleAnalytics
   * @param {...any} options - The options to set.
   * @see https://developers.google.com/analytics/devguides/collection/gtagjs/setting-values
   *
   * ```js
   * gtag('set', {
   *   'currency': 'USD',
   *   'country': 'US'
   * });
   * ```
   */
  set(...options: any[]) {
    try {
      this._gtag('set', ...options);
    } catch (err: any) {
      this.throw(err);
    }
  }

  /**
   * Send an event to GA to report an application error. It is the same as
   *
   * ```js
   * gtag('event', 'exception', {
   * 'description': 'error_description',
   * 'fatal': false   // set to true if the error is fatal
   * });
   * ```
   * @param {string} [description] - 'error_description'
   * @param {boolean} [fatal] - set to true if the error is fatal
   */
  exception(description?: string, fatal?: boolean) {
    try {
      const opt = new Map<string, any>();
      if (description) {
        opt.set('description', description);
      }
      if (fatal) {
        opt.set('fatal', fatal);
      }
      const params = this.toKeyValue(opt);
      if (params) {
        this.gtag('event', 'exception', this.toKeyValue(opt));
      } else {
        this.gtag('event', 'exception');
      }
    } catch (error: any) {
      this.throw(error);
    }
  }
}
