import { Directive, input } from '@angular/core';

@Directive({
  exportAs: 'gaCategory',
  selector: `[gaEvent][gaCategory],[gaCategory]`,
})
export class GaEventCategoryDirective {
  readonly gaCategory = input.required<string>();
}
