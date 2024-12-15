/*
 * Public API Surface of google-recaptcha
 */

export { RecaptchaComponent } from './lib/recaptcha.component';
export { RecaptchaDirective } from './lib/recaptcha.directive';
export type { RecaptchaErrorParameters } from './lib/recaptcha.directive';
export { RecaptchaLoaderService } from './lib/recaptcha-loader.service';
export { RecaptchaModule } from './lib/recaptcha.module';
export type { RecaptchaSettings } from './lib/recaptcha-settings';

export { RecaptchaV3Module } from './lib/recaptcha-v3.module';
export { ReCaptchaV3Service } from './lib/recaptcha-v3.service';
export type { OnExecuteData, OnExecuteErrorData } from './lib/recaptcha-v3.service';

export { RecaptchaFormsModule } from './lib/recaptcha-forms.module';

export {
  RECAPTCHA_LANGUAGE,
  RECAPTCHA_BASE_URL,
  RECAPTCHA_NONCE,
  RECAPTCHA_SETTINGS,
  RECAPTCHA_V3_SITE_KEY,
  RECAPTCHA_LOADER_OPTIONS,
} from './lib/tokens';
export type { RecaptchaLoaderOptions } from './lib/tokens';
