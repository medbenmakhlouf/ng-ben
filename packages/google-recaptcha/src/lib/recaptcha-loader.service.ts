/* eslint-disable jsdoc/no-undefined-types */
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, type Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { loader } from './load-script';
import { RECAPTCHA_LOADER_OPTIONS, RECAPTCHA_V3_SITE_KEY } from './tokens';
import { type RecaptchaLoaderOptions } from './types';

@Injectable()
export class RecaptchaLoaderService {
  /** @internal */
  private readonly platformId = inject(PLATFORM_ID);
  /** @internal */
  private v3SiteKey = inject<string | null>(RECAPTCHA_V3_SITE_KEY, { optional: true });
  /** @internal */
  private options = inject<RecaptchaLoaderOptions | null>(RECAPTCHA_LOADER_OPTIONS, { optional: true });
  /** @internal */
  private subject = new BehaviorSubject<ReCaptchaV2.ReCaptcha | null>(null);
  /** @internal */
  private static ready: BehaviorSubject<ReCaptchaV2.ReCaptcha | null>;
  /** @public */
  public ready: Observable<ReCaptchaV2.ReCaptcha> = (isPlatformBrowser(this.platformId) ? this.init() : this.subject)
    .asObservable()
    .pipe(
      filter((value) => value !== null),
      filter((grecaptcha: ReCaptchaV2.ReCaptcha) => typeof grecaptcha.render === 'function'),
    );

  /**
   * @internal
   * @returns {BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | undefined} A BehaviorSubject that emits ReCaptcha instances or `undefined` if not in a browser platform.
   */
  private init(): BehaviorSubject<ReCaptchaV2.ReCaptcha | null> {
    if (RecaptchaLoaderService.ready) {
      return RecaptchaLoaderService.ready;
    }
    RecaptchaLoaderService.ready = this.subject;
    loader.loadScript({
      renderMode: this.v3SiteKey ? { key: this.v3SiteKey } : 'explicit',
      onBeforeLoad: (url) => {
        if (this.options?.onBeforeLoad) {
          return this.options.onBeforeLoad(url);
        }
        return { url };
      },
      onLoaded: (recaptcha) => {
        let value = recaptcha;
        if (this.options?.onLoaded) {
          value = this.options.onLoaded(recaptcha);
        }
        this.subject.next(value);
      },
    });
    return this.subject;
  }
}
