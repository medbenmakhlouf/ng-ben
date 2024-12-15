import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RecaptchaCommonModule } from './recaptcha-common.module';
import { RecaptchaDirective } from './recaptcha.directive';

/**
 * @deprecated This module will be removed in the next major version.
 */
@NgModule({
  exports: [RecaptchaDirective],
  imports: [FormsModule, RecaptchaCommonModule, RecaptchaDirective],
})
export class RecaptchaFormsModule {}
