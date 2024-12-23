import { Directive, Input, inject } from '@angular/core';

import { GaEventDirective } from './ga-event.directive';

@Directive({
  selector: `input[gaEvent], select[gaEvent],textarea[gaEvent]`,
})
export class GaEventFormInputDirective {
  protected gaEvent = inject(GaEventDirective, { host: true, optional: true })!;

  constructor() {
    this.gaBind = 'focus';
  }

  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  @Input() set gaBind(bind: string) {
    if (this.gaEvent) {
      this.gaEvent.gaBind = bind;
    }
  }
}
