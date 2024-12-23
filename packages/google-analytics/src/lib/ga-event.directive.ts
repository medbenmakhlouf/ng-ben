/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Directive, ElementRef, isDevMode, type OnDestroy, inject, input, effect } from '@angular/core';
import { fromEvent, type Subscription } from 'rxjs';
import { GoogleAnalyticsSettings } from './types';
import { NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN } from './tokens';
import { GoogleAnalyticsService } from './google-analytics.service';
import { type GaActionEnum } from './enums';

@Directive({
  selector: `[gaEvent],input[gaEvent],select[gaEvent],textarea[gaEvent]`,
  exportAs: 'gaEvent',
})
export class GaEventDirective implements OnDestroy {
  private gaService = inject(GoogleAnalyticsService);
  private settings = inject<GoogleAnalyticsSettings>(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN);
  private readonly el = inject(ElementRef);
  private bindSubscription?: Subscription;
  readonly gaCategory = input<string>();
  readonly gaBind = input<string>('click');
  readonly gaAction = input.required<GaActionEnum | string>();
  readonly gaLabel = input<string>();
  readonly label = input<string>();
  readonly gaValue = input<number>();
  readonly gaInteraction = input<boolean>();
  readonly gaEvent = input.required<GaActionEnum | string>();

  constructor() {
    effect(() => {
      if (this.bindSubscription) {
        this.bindSubscription.unsubscribe();
      }
      this.bindSubscription = fromEvent(this.el.nativeElement, this.gaBind()).subscribe(() => this.trigger());
    });
  }

  // private _gaBind!: string;

  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  // @Input() set gaBind(gaBind: string) {
  //   if (this.bindSubscription) {
  //     this.bindSubscription.unsubscribe();
  //   }
  //
  //   this._gaBind = gaBind;
  //   this.bindSubscription = fromEvent(this.el.nativeElement, gaBind).subscribe(() => this.trigger());
  // }
  // get gaBind(): string {
  //   return this._gaBind;
  // }

  ngOnDestroy() {
    if (this.bindSubscription) {
      this.bindSubscription.unsubscribe();
    }
  }

  protected trigger() {
    try {
      const gaAction = this.gaAction();
      const gaEvent = this.gaEvent();
      if (!gaAction && !gaEvent) {
        throw new Error('You must provide a gaAction attribute to identify this event.');
      }

      this.gaService.event(
        gaAction || gaEvent,
        this.gaCategory() ? this.gaCategory() : undefined,
        this.gaLabel() || this.label(),
        this.gaValue(),
        this.gaInteraction(),
      );
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
