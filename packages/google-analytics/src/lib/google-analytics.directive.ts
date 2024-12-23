import { Directive, ElementRef, inject, input, afterRenderEffect, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, switchMap } from 'rxjs';
import { type GoogleAnalyticEvent } from './types';
import { GoogleAnalyticsService } from './google-analytics.service';

@Directive({
  selector: `[google-analytics],input[google-analytics],select[google-analytics],textarea[google-analytics]`,
  exportAs: 'googleAnalytics',
})
export class GoogleAnalyticsDirective {
  private gaService = inject(GoogleAnalyticsService);
  private readonly el = inject(ElementRef);
  readonly data = input.required<GoogleAnalyticEvent>();
  readonly bindTo = input<string>('click');
  readonly eventName = computed(() => {
    const isInput = ['INPUT', 'TEXTAREA'].includes(this.el.nativeElement.tagName);
    return isInput && this.bindTo() === 'click' ? 'focus' : this.bindTo();
  });
  private bindTo$ = toObservable(this.eventName).pipe(
    switchMap((eventName: string) => fromEvent(this.el.nativeElement, eventName)),
  );
  private fromBindTo = toSignal(this.bindTo$);

  constructor() {
    afterRenderEffect(() => {
      const fromBindTo = this.fromBindTo();
      if (fromBindTo) this.trigger();
    });
  }

  private trigger() {
    try {
      if (!this.data().action) {
        throw new Error('You must provide a gaAction attribute to identify this event.');
      }
      this.gaService.event(this.data());
    } catch (err: any) {
      this.gaService.throwWarn(err);
    }
  }
}
