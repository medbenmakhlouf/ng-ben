import { NgModule } from '@angular/core';

import { RecaptchaComponent } from './recaptcha.component';

/**
 * @deprecated This module will be removed in the next major version.
 */
@NgModule({
  imports: [RecaptchaComponent],
  exports: [RecaptchaComponent],
})
export class RecaptchaCommonModule {}
