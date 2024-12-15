import { Directive, Host, Optional, Input } from '@angular/core';
import { GaEventDirective } from './ga-event.directive';

@Directive({
  selector: `input[gaEvent],
             select[gaEvent],
             textarea[gaEvent]`,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class GaEventFormInputDirective {
  constructor(@Host() @Optional() protected gaEvent: GaEventDirective) {
    this.gaBind = 'focus';
  }

  @Input() set gaBind(bind: string) {
    if (this.gaEvent) {
      this.gaEvent.gaBind = bind;
    }
  }
}
