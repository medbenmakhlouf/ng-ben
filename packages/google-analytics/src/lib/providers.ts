import {
  APP_BOOTSTRAP_LISTENER,
  type EnvironmentProviders,
  makeEnvironmentProviders,
  provideAppInitializer,
  type Provider,
} from '@angular/core';
import { initializerFactory, routerInitializerFactory } from './factories';
import { GoogleAnalyticsService } from './google-analytics.service';
import { type GoogleAnalyticsRoutingSettings, type GoogleAnalyticsSettings } from './types';
import { ROUTING_SETTINGS, GLOBAL_SETTINGS } from './tokens';

/**
 * Install Google Analytics Tracking code on your environment and configure tracking ID.
 *
 * You should provide a valid Google TrackingCode. This code will be provided to the entire application by
 * `NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN` token. You can inject this code in you components if you like by
 * use the following injection code `@Inject(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN) gaConfig: IGoogleAnalyticsSettings`
 * This module should be a dependency on the highest level module of the application, i.e. AppConfig in most use cases.
 *
 * Provides Google Analytics Router settings.
 *
 * Attach a listener to `NavigationEnd` Router event. So, every time Router finish the page resolution it should call `NavigationEnd` event.
 * We assume that NavigationEnd is the final page resolution and call GA `page_view` command.
 *
 * To avoid double binds, we also destroy the subscription when de Bootstrap Component is destroied. But, we don't know for sure
 * that this strategy does not cause double bind on multiple bootstrap components.
 *
 * We are using de component's injector reference to resolve Router, sou I hope there is no problem w/ double bing.
 *
 * If you have this problem, I encourage not Use NgxGoogleAnalyticsRouterModule and atach the listener on AppComponent initialization.
 *
 * This Module is just a sugar for:
 *
 * ```typescript
 * constructor(private router: Router) {}
 * ...
 * ngOnInit() {
 *   ...
 *   this.router
 *     .events
 *     .pipe(takeUntil(this.onDestroy$))
 *     .subscribe(event => {
 *       if (event instanceof NavigationEnd) {
 *         gaService.pageView(event.urlAfterRedirects, undefined);
 *       }
 *     });
 * ```
 * @param {GoogleAnalyticsSettings} [settings] - The settings for Google Analytics.*
 * @param {GoogleAnalyticsRoutingSettings} [routerSettings] - The routing settings for Google Analytics.
 * @returns {EnvironmentProviders} An array of environment providers.
 */
export function provideGoogleAnalytic(
  settings?: GoogleAnalyticsSettings,
  routerSettings?: GoogleAnalyticsRoutingSettings,
): EnvironmentProviders {
  const providers: Provider[] = [{ provide: GLOBAL_SETTINGS, useValue: settings }];
  if (routerSettings) {
    providers.push({ provide: ROUTING_SETTINGS, useValue: routerSettings });
    /**
     * Provide a DI Configuration to attach GA Trigger to Router Events at Angular Startup Cycle.
     */
    providers.push({
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: routerInitializerFactory,
      deps: [ROUTING_SETTINGS, GoogleAnalyticsService],
      multi: true,
    });
  }
  /**
   * Provide a DI Configuration to attach GA Initialization at Angular Startup Cycle.
   */
  return makeEnvironmentProviders([providers, provideAppInitializer(initializerFactory)]);
}
