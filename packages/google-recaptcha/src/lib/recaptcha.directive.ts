import {
  AfterViewInit,
  ElementRef,
  OutputEmitterRef,
  NgZone,
  inject,
  output,
  input,
  DestroyRef,
  computed,
  Directive,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { RecaptchaLoaderService } from './recaptcha-loader.service';
import { RecaptchaSettings } from './recaptcha-settings';
import { RECAPTCHA_SETTINGS } from './tokens';

let nextId = 0;

export type NeverUndefined<T> = T extends undefined ? never : T;

export type RecaptchaErrorParameters = Parameters<NeverUndefined<ReCaptchaV2.Parameters['error-callback']>>;

@Directive({
  exportAs: 'reCaptcha',
  selector: '[re-captcha]',
  host: {
    '[attr.id]': 'id()',
  },
})
export class RecaptchaDirective implements AfterViewInit {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private loader = inject(RecaptchaLoaderService);
  private zone = inject(NgZone);
  private settings = inject<RecaptchaSettings>(RECAPTCHA_SETTINGS, { optional: true });
  private destroyRef = inject(DestroyRef);

  public readonly id = input<string>(`ngrecaptcha-${nextId++}`);
  public readonly siteKey = input(this.settings ? this.settings.siteKey : undefined);
  public readonly theme = input<ReCaptchaV2.Theme | undefined>(this.settings ? this.settings.theme : undefined);
  public readonly type = input<ReCaptchaV2.Type | undefined>(this.settings ? this.settings.type : undefined);
  public readonly size = input<ReCaptchaV2.Size | undefined>(this.settings ? this.settings.size : undefined);
  public readonly tabIndex = input<number>();
  public readonly badge = input<ReCaptchaV2.Badge | undefined>(this.settings ? this.settings.badge : undefined);
  public readonly errorMode = input<'handled' | 'default'>('default');
  public readonly resolved: OutputEmitterRef<string | null> = output<string | null>();
  public readonly errored: OutputEmitterRef<RecaptchaErrorParameters> = output<RecaptchaErrorParameters>();

  /** @internal */
  private grecaptcha$ = this.loader.ready.pipe(
    filter((grecaptcha: ReCaptchaV2.ReCaptcha) => typeof grecaptcha.render === 'function'),
  );
  /** @internal */
  private subscription!: Subscription;
  /** @internal */
  private widget!: number;
  /** @internal */
  private grecaptcha!: ReCaptchaV2.ReCaptcha;
  /** @internal */
  private executeRequested!: boolean;
  /** @internal */
  private renderOptions = computed<ReCaptchaV2.Parameters>(() => {
    const options: ReCaptchaV2.Parameters = {
      badge: this.badge(),
      sitekey: this.siteKey(),
      size: this.size(),
      tabindex: this.tabIndex(),
      theme: this.theme(),
      type: this.type(),
      callback: (response: string) => this.zone.run(() => this.captchaResponseCallback(response)),
      'expired-callback': () => this.zone.run(() => this.expired()),
    };
    if (this.errorMode() === 'handled') {
      options['error-callback'] = (...args: RecaptchaErrorParameters) => {
        this.zone.run(() => this.onError(args));
      };
    }
    return options;
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.onDestroy());
  }

  public ngAfterViewInit(): void {
    this.subscription = this.grecaptcha$.subscribe((grecaptcha: ReCaptchaV2.ReCaptcha) => {
      this.grecaptcha = grecaptcha;
      this.renderRecaptcha();
    });
  }

  public onDestroy() {
    // reset the captcha to ensure it does not leave anything behind
    // after the component is no longer needed
    this.resetRecaptcha();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Executes the invisible recaptcha.
   * Does nothing if component's size is not set to "invisible".
   */
  public execute(): void {
    if (this.size() !== 'invisible') {
      return;
    }

    if (this.widget != null) {
      void this.grecaptcha.execute(this.widget);
    } else {
      // delay execution of recaptcha until it actually renders
      this.executeRequested = true;
    }
  }

  public reset(): void {
    if (this.widget != null) {
      if (this.grecaptcha.getResponse(this.widget)) {
        // Only emit an event in case if something would actually change.
        // That way we do not trigger "touching" of the control if someone does a "reset"
        // on a non-resolved captcha.
        this.resolved.emit(null);
      }
      this.resetRecaptcha();
    }
  }

  /**
   * ⚠️ Warning! Use this property at your own risk!
   *
   * While this member is `public`, it is not a part of the component's public API.
   * The semantic versioning guarantees _will not be honored_! Thus, you might find that this property behavior changes in incompatible ways in minor or even patch releases.
   * You are **strongly advised** against using this property.
   * Instead, use more idiomatic ways to get reCAPTCHA value, such as `resolved` EventEmitter, or form-bound methods (ngModel, formControl, and the likes).
   * @returns {string | null} The reCAPTCHA value or null if the widget is not available.
   */
  public get __unsafe_widgetValue(): string | null {
    return this.widget != null ? this.grecaptcha.getResponse(this.widget) : null;
  }

  /** @internal */
  private expired() {
    this.resolved.emit(null);
  }

  /**
   * Handles the error callback for reCAPTCHA.
   * @param {RecaptchaErrorParameters} args - The error parameters.
   * @internal
   */
  private onError(args: RecaptchaErrorParameters) {
    this.errored.emit(args);
  }

  /**
   * @param {string} response - The response string from the reCAPTCHA.
   * @internal
   */
  private captchaResponseCallback(response: string) {
    this.resolved.emit(response);
  }

  /** @internal */
  private resetRecaptcha() {
    if (this.widget != null) {
      this.zone.runOutsideAngular(() => this.grecaptcha.reset(this.widget));
    }
  }

  /** @internal */
  private renderRecaptcha() {
    this.widget = this.grecaptcha.render(this.elementRef.nativeElement, this.renderOptions());
    if (this.executeRequested) {
      this.executeRequested = false;
      this.execute();
    }
  }
}
