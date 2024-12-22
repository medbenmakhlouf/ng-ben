/* eslint-disable jsdoc/no-undefined-types */
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { loader } from './load-script';
import { RECAPTCHA_LOADER_OPTIONS, RECAPTCHA_V3_SITE_KEY } from './tokens';
import { RecaptchaLoaderOptions } from './types';

@Injectable()
export class RecaptchaLoaderService {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * @internal
   */
  private static ready: BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | null = null;

  public ready: Observable<ReCaptchaV2.ReCaptcha>;

  /** @internal */
  private v3SiteKey = inject<string | null>(RECAPTCHA_V3_SITE_KEY, { optional: true });
  /** @internal */
  private options = inject<RecaptchaLoaderOptions | null>(RECAPTCHA_LOADER_OPTIONS, { optional: true });

  constructor() {
    this.ready = this.init()
      .asObservable()
      .pipe(filter((value) => value !== null));
  }

  /**
   * @internal
   * @returns {BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | undefined} A BehaviorSubject that emits ReCaptcha instances or `undefined` if not in a browser platform.
   */
  private init(): BehaviorSubject<ReCaptchaV2.ReCaptcha | null> {
    if (RecaptchaLoaderService.ready) {
      return RecaptchaLoaderService.ready;
    }

    const subject = new BehaviorSubject<ReCaptchaV2.ReCaptcha | null>(null);
    if (!isPlatformBrowser(this.platformId)) {
      return subject;
    }

    RecaptchaLoaderService.ready = subject;

    loader.newLoadScript({
      v3SiteKey: this.v3SiteKey,
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
        subject.next(value);
      },
    });

    return subject;
  }
}
