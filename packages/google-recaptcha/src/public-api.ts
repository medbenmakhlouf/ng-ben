/*
 * Public API Surface of google-recaptcha
 */

export { RecaptchaComponent } from './lib/recaptcha.component';
export { RecaptchaDirective } from './lib/recaptcha.directive';
export { RecaptchaLoaderService } from './lib/recaptcha-loader.service';
export { ReCaptchaV3Service } from './lib/recaptcha-v3.service';
export { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RECAPTCHA_LOADER_OPTIONS } from './lib/tokens';
export type {
  RecaptchaSettings,
  OnExecuteErrorData,
  OnExecuteData,
  RecaptchaErrorParameters,
  RecaptchaLoaderOptions,
} from './lib/types';
