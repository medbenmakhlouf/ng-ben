import { Directive, Input } from '@angular/core';

@Directive({
  selector: `[gaEvent][gaCategory],[gaCategory]`,
  exportAs: 'gaCategory',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class GaEventCategoryDirective {
  @Input() gaCategory!: string;
}
