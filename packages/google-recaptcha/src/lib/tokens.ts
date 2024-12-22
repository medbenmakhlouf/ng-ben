import { InjectionToken } from '@angular/core';

import { RecaptchaLoaderOptions, RecaptchaSettings } from './types';

export const RECAPTCHA_SETTINGS = new InjectionToken<RecaptchaSettings>('recaptcha-settings');
export const RECAPTCHA_V3_SITE_KEY = new InjectionToken<string>('recaptcha-v3-site-key');
/**
 * See the documentation for `RecaptchaLoaderOptions`.
 */
export const RECAPTCHA_LOADER_OPTIONS = new InjectionToken<RecaptchaLoaderOptions>('recaptcha-loader-options');
