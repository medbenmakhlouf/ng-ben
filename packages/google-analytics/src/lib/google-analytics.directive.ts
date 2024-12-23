import { Directive, ElementRef, isDevMode, type OnDestroy, inject, input, effect } from '@angular/core';
import { fromEvent, type Subscription } from 'rxjs';
import { type GoogleAnalyticEvent, type GoogleAnalyticsSettings } from './types';
import { NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN } from './tokens';
import { GoogleAnalyticsService } from './google-analytics.service';

@Directive({
  selector: `[google-analytics],input[google-analytics],select[google-analytics],textarea[google-analytics]`,
  exportAs: 'googleAnalytics',
})
export class GoogleAnalyticsDirective implements OnDestroy {
  private gaService = inject(GoogleAnalyticsService);
  private settings = inject<GoogleAnalyticsSettings>(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN);
  private readonly el = inject(ElementRef);
  readonly data = input.required<GoogleAnalyticEvent>();
  readonly bindTo = input<string>('click');
  private bindSubscription: Subscription | undefined;

  constructor() {
    effect(() => {
      if (this.bindSubscription) {
        this.bindSubscription.unsubscribe();
      }
      this.bindSubscription = fromEvent(this.el.nativeElement, this.bindTo()).subscribe(() => this.trigger());
    });
  }

  ngOnDestroy() {
    if (this.bindSubscription) {
      this.bindSubscription.unsubscribe();
    }
  }

  protected trigger() {
    try {
      if (!this.data().action) {
        throw new Error('You must provide a gaAction attribute to identify this event.');
      }
      this.gaService.event(this.data());
    } catch (err: any) {
      this.throw(err);
    }
  }

  protected throw(err: Error) {
    if ((isDevMode() || this.settings.enableTracing) && console && console.warn) {
      console.warn(err);
    }
  }
}
