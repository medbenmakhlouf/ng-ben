/*
 * Public API Surface of google-analytics
 */

export * from './lib/directives/ga-event-category.directive';
export * from './lib/directives/ga-event.directive';
export * from './lib/directives/ga-event-form-input.directive';

export * from './lib/enums/ga-action.enum';

export * from './lib/google-analytics.initializer';
export * from './lib/google-analytics-router.initializer';

export * from './lib/interfaces/i-google-analytics-command';
export * from './lib/interfaces/i-google-analytics-routing-settings';
export * from './lib/interfaces/i-google-analytics-settings';

export * from './lib/services/google-analytics.service';

export * from './lib/tokens';
export * from './lib/tokens/ngx-google-analytics-settings-token';
export * from './lib/tokens/ngx-gtag-token';
export * from './lib/tokens/ngx-window-token';

export * from './lib/types';

export * from './lib/ngx-google-analytics.module';
export * from './lib/ngx-google-analytics-router.module';
