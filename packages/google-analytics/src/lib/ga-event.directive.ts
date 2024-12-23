/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Directive, ElementRef, Input, isDevMode, type OnDestroy, inject } from '@angular/core';
import { fromEvent, type Subscription } from 'rxjs';
import { GaEventCategoryDirective } from './ga-event-category.directive';
import { GoogleAnalyticsSettings } from './types';
import { NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN } from './tokens';
import { GoogleAnalyticsService } from './google-analytics.service';
import { type GaActionEnum } from './enums';

@Directive({
  selector: `[gaEvent]`,
  exportAs: 'gaEvent',
})
export class GaEventDirective implements OnDestroy {
  private gaCategoryDirective = inject(GaEventCategoryDirective, { optional: true })!;
  private gaService = inject(GoogleAnalyticsService);
  private settings = inject<GoogleAnalyticsSettings>(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN);
  private readonly el = inject(ElementRef);

  constructor() {
    this.gaBind = 'click';
  }

  private bindSubscription?: Subscription;

  @Input() gaAction!: GaActionEnum | string;
  @Input() gaLabel!: string;
  @Input() label!: string;
  @Input() gaValue!: number;
  @Input() gaInteraction!: boolean;
  @Input() gaEvent!: GaActionEnum | string;

  private _gaBind!: string;

  @Input() set gaBind(gaBind: string) {
    if (this.bindSubscription) {
      this.bindSubscription.unsubscribe();
    }

    this._gaBind = gaBind;
    this.bindSubscription = fromEvent(this.el.nativeElement, gaBind).subscribe(() => this.trigger());
  }
  get gaBind(): string {
    return this._gaBind;
  }

  ngOnDestroy() {
    if (this.bindSubscription) {
      this.bindSubscription.unsubscribe();
    }
  }

  protected trigger() {
    try {
      // Observação: não é obrigatório especificar uma categoria, uma etiqueta ou um valor. Consulte Eventos padrão do Google Analytics abaixo.
      // if (!this.$gaCategoryDirective) {
      //   throw new Error('You must provide a gaCategory attribute w/ gaEvent Directive.');
      // }

      if (!this.gaAction && !this.gaEvent) {
        throw new Error('You must provide a gaAction attribute to identify this event.');
      }

      this.gaService.event(
        this.gaAction || this.gaEvent,
        this.gaCategoryDirective ? this.gaCategoryDirective.gaCategory : undefined,
        this.gaLabel || this.label,
        this.gaValue,
        this.gaInteraction,
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
