import { DOCUMENT } from '@angular/common';
import { type ComponentRef, inject, isDevMode } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, skip } from 'rxjs/operators';
import { NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN, NGX_GTAG_FN } from './tokens';
import type { GoogleAnalyticsRoutingSettings, GoogleAnalyticsSettings, GtagFn } from './types';
import { type GoogleAnalyticsService } from './google-analytics.service';

/**
 * Create a script element on DOM and link it to Google Analytics tracking code URI.
 * After that, execute exactly same init process as tracking snippet code.
 * @returns {Promise<void> | void} An async function that initializes Google Analytics.
 */
export const initializerFactory = (): Promise<void> | void => {
  // The Google Analytics settings.
  const settings = inject<GoogleAnalyticsSettings>(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN);
  //  The Google Analytics function.
  const gtag = inject<GtagFn>(NGX_GTAG_FN);
  // The Document interface.
  const document = inject<Document>(DOCUMENT);
  if (!settings.trackingCode) {
    if (!isDevMode()) {
      console.error(
        'Empty tracking code for Google Analytics. Make sure to provide one when initializing NgxGoogleAnalyticsModule.',
      );
    }
    return Promise.resolve();
  }

  if (!gtag) {
    if (!isDevMode()) {
      console.error(
        'Was not possible create or read gtag() fn. Make sure this module is running on a Browser w/ access to Window interface.',
      );
    }

    return Promise.resolve();
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

/**
 * Attach a listener to `NavigationEnd` Router event. So, every time Router finish the page resolution it should call `NavigationEnd` event.
 * We assume that NavigationEnd is the final page resolution and call GA `page_view` command.
 *
 * To avoid double binds, we also destroy the subscription when the Bootstrap Component is destroyed. But, we don't know for sure
 * that this strategy does not cause double bind on multiple bootstrap components.
 *
 * We are using the component's injector reference to resolve Router, so I hope there is no problem with double binding.
 *
 * If you have this problem, I encourage not to use NgxGoogleAnalyticsRouterModule and attach the listener on AppComponent initialization.
 * @param {GoogleAnalyticsRoutingSettings | null} settings - The settings for Google Analytics routing.
 * @param {GoogleAnalyticsService} gaService - The Google Analytics service.
 * @returns {(c: ComponentRef<any>) => void} A function that attaches the listener to the router events.
 */
export function routerInitializerFactory(
  settings: GoogleAnalyticsRoutingSettings | null,
  gaService: GoogleAnalyticsService,
): (c: ComponentRef<any>) => void {
  return (c: ComponentRef<any>) => {
    const router = c.injector.get(Router);
    const { include = [], exclude = [] } = settings ?? {};
    const includeRules = normalizePathRules(include);
    const excludeRules = normalizePathRules(exclude);
    const subs = router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        skip(1), // Prevend double views on the first tigger (because GA Already send one ping on setup)
        filter((event) =>
          includeRules.length > 0 ? includeRules.some((rule) => rule.test(event.urlAfterRedirects)) : true,
        ),
        filter((event) =>
          excludeRules.length > 0 ? !excludeRules.some((rule) => rule.test(event.urlAfterRedirects)) : true,
        ),
      )
      .subscribe((event) => gaService.pageView(event.urlAfterRedirects, undefined));
    // Cleanup
    c.onDestroy(() => subs.unsubscribe());
  };
}

/**
 * Converts all path rules from string to Regex instances
 * @param {Array<string | RegExp>} rules - The path rules to convert.
 * @returns {Array<RegExp>} The converted path rules as Regex instances.
 */
function normalizePathRules(rules: (string | RegExp)[]): RegExp[] {
  return rules.map((rule) => (rule instanceof RegExp ? rule : new RegExp(`^${rule.replace('*', '.*')}$`, 'i')));
}
