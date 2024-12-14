import { NgModule } from '@angular/core';

import { RecaptchaCommonModule } from './recaptcha-common.module';
import { RecaptchaLoaderService } from './recaptcha-loader.service';
import { RecaptchaComponent } from './recaptcha.component';

/**
 * @deprecated This module will be removed in the next major version.
 */
@NgModule({
  exports: [RecaptchaComponent],
  imports: [RecaptchaCommonModule],
  providers: [RecaptchaLoaderService],
})
export class RecaptchaModule {}
