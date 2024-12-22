import { Directive, Input } from '@angular/core';

@Directive({
  exportAs: 'gaCategory',
  selector: `[gaEvent][gaCategory],[gaCategory]`,
})
export class GaEventCategoryDirective {
  @Input() gaCategory!: string;
}
