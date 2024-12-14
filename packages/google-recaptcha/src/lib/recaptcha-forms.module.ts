import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RecaptchaCommonModule } from './recaptcha-common.module';
import { RecaptchaValueAccessorDirective } from './recaptcha-value-accessor.directive';

/**
 * @deprecated This module will be removed in the next major version.
 */
@NgModule({
  exports: [RecaptchaValueAccessorDirective],
  imports: [FormsModule, RecaptchaCommonModule, RecaptchaValueAccessorDirective],
})
export class RecaptchaFormsModule {}
