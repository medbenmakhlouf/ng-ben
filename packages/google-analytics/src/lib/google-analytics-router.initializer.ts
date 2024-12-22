import { type Provider, APP_BOOTSTRAP_LISTENER, type ComponentRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, skip } from 'rxjs/operators';
import { GoogleAnalyticsService } from './google-analytics.service';
import { NGX_GOOGLE_ANALYTICS_ROUTING_SETTINGS_TOKEN } from './tokens';
import { type IGoogleAnalyticsRoutingSettings } from './types';

/**
 * Provide a DI Configuration to attach GA Trigger to Router Events at Angular Startup Cycle.
 */
export const NGX_GOOGLE_ANALYTICS_ROUTER_INITIALIZER_PROVIDER: Provider = {
  provide: APP_BOOTSTRAP_LISTENER,
  multi: true,
  useFactory: GoogleAnalyticsRouterInitializer,
  deps: [NGX_GOOGLE_ANALYTICS_ROUTING_SETTINGS_TOKEN, GoogleAnalyticsService],
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
 * @param {IGoogleAnalyticsRoutingSettings | null} settings - The settings for Google Analytics routing.
 * @param {GoogleAnalyticsService} gaService - The Google Analytics service.
 * @returns {(c: ComponentRef<any>) => void} A function that attaches the listener to the router events.
 */
export function GoogleAnalyticsRouterInitializer(
  settings: IGoogleAnalyticsRoutingSettings | null,
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
