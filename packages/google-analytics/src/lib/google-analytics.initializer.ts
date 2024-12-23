import { type Provider, APP_INITIALIZER, isDevMode } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN, NGX_GTAG_FN } from './tokens';
import { type GtagFn, type GoogleAnalyticsSettings } from './types';

/**
 * Provide a DI Configuration to attach GA Initialization at Angular Startup Cycle.
 */
export const NGX_GOOGLE_ANALYTICS_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: GoogleAnalyticsInitializer,
  deps: [NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN, NGX_GTAG_FN, DOCUMENT],
};

/**
 * Create a script element on DOM and link it to Google Analytics tracking code URI.
 * After that, execute exactly same init process as tracking snippet code.
 * @param {GoogleAnalyticsSettings} settings - The Google Analytics settings.
 * @param {GtagFn} gtag - The Google Analytics function.
 * @param {Document} document - The Document interface.
 * @returns {() => Promise<void>} An async function that initializes Google Analytics.
 */
export function GoogleAnalyticsInitializer(
  settings: GoogleAnalyticsSettings,
  gtag: GtagFn,
  document: Document,
): () => Promise<void> {
  return async () => {
    if (!settings.trackingCode) {
      if (!isDevMode()) {
        console.error(
          'Empty tracking code for Google Analytics. Make sure to provide one when initializing NgxGoogleAnalyticsModule.',
        );
      }

      return;
    }

    if (!gtag) {
      if (!isDevMode()) {
        console.error(
          'Was not possible create or read gtag() fn. Make sure this module is running on a Browser w/ access to Window interface.',
        );
      }

      return;
    }

    if (!document) {
      if (!isDevMode()) {
        console.error(
          'Was not possible to access Document interface. Make sure this module is running on a Browser w/ access do Document interface.',
        );
      }
    }

    // Set default ga.js uri
    settings.uri = settings.uri || `https://www.googletagmanager.com/gtag/js?id=${settings.trackingCode}`;

    // these commands should run first!
    settings.initCommands = settings?.initCommands ?? [];

    // assert config command
    if (!settings.initCommands.find((x) => x.command === 'config')) {
      settings.initCommands.unshift({ command: 'config', values: [settings.trackingCode] });
    }

    // assert js command
    if (!settings.initCommands.find((x) => x.command === 'js')) {
      settings.initCommands.unshift({ command: 'js', values: [new Date()] });
    }

    for (const command of settings.initCommands) {
      gtag(command.command, ...command.values);
    }

    const s: HTMLScriptElement = document.createElement('script');
    s.async = true;
    s.src = settings.uri;

    if (settings.nonce) {
      s.setAttribute('nonce', settings.nonce);
    }

    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    head.appendChild(s);
  };
}
