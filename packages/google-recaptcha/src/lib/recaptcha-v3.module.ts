import { NgModule } from '@angular/core';

import { ReCaptchaV3Service } from './recaptcha-v3.service';
import { RecaptchaLoaderService } from './recaptcha-loader.service';

/**
 * @deprecated This module will be removed in the next major version.
 */
@NgModule({
  providers: [ReCaptchaV3Service, RecaptchaLoaderService],
})
export class RecaptchaV3Module {}
