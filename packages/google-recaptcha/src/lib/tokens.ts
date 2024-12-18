import { InjectionToken } from '@angular/core';

import { RecaptchaLoaderOptions, RecaptchaSettings } from './types';

/** @deprecated Use `LOADER_OPTIONS` instead. See `RecaptchaLoaderOptions.onBeforeLoad` */
export const RECAPTCHA_LANGUAGE = new InjectionToken<string>('recaptcha-language');
/** @deprecated Use `LOADER_OPTIONS` instead. See `RecaptchaLoaderOptions.onBeforeLoad` */
export const RECAPTCHA_BASE_URL = new InjectionToken<string>('recaptcha-base-url');
/** @deprecated Use `LOADER_OPTIONS` instead. See `RecaptchaLoaderOptions.onBeforeLoad` */
export const RECAPTCHA_NONCE = new InjectionToken<string>('recaptcha-nonce-tag');
export const RECAPTCHA_SETTINGS = new InjectionToken<RecaptchaSettings>('recaptcha-settings');
export const RECAPTCHA_V3_SITE_KEY = new InjectionToken<string>('recaptcha-v3-site-key');
/**
 * See the documentation for `RecaptchaLoaderOptions`.
 */
export const RECAPTCHA_LOADER_OPTIONS = new InjectionToken<RecaptchaLoaderOptions>('recaptcha-loader-options');
