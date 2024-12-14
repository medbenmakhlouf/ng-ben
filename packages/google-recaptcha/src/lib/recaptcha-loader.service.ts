/* eslint-disable jsdoc/no-undefined-types */
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { loader } from './load-script';
import {
  RECAPTCHA_LOADER_OPTIONS,
  RECAPTCHA_BASE_URL,
  RECAPTCHA_LANGUAGE,
  RECAPTCHA_NONCE,
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaLoaderOptions,
} from './tokens';

/**
 * Converts a BehaviorSubject to an Observable that filters out null values.
 * @template T
 * @param {BehaviorSubject<T>} subject - The BehaviorSubject to convert.
 * @returns {Observable<T>} An Observable that emits non-null values.
 */
function toNonNullObservable<T>(subject: BehaviorSubject<T>): Observable<T> {
  return subject.asObservable().pipe(filter<T>((value) => value !== null));
}

@Injectable()
export class RecaptchaLoaderService {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * @internal
   */
  private static ready: BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | null = null;

  public ready: Observable<ReCaptchaV2.ReCaptcha | null>;

  /** @internal */
  private language = inject<string | null>(RECAPTCHA_LANGUAGE, { optional: true });
  /** @internal */
  private baseUrl = inject<string>(RECAPTCHA_BASE_URL, { optional: true });
  /** @internal */
  private nonce = inject<string | null>(RECAPTCHA_NONCE, { optional: true });
  /** @internal */
  private v3SiteKey = inject<string | null>(RECAPTCHA_V3_SITE_KEY, { optional: true });
  /** @internal */
  private options = inject<RecaptchaLoaderOptions | null>(RECAPTCHA_LOADER_OPTIONS, { optional: true });

  constructor() {
    const subject = this.init();
    this.ready = subject ? toNonNullObservable(subject) : of();
  }

  /**
   * @internal
   * @returns {BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | undefined} A BehaviorSubject that emits ReCaptcha instances or `undefined` if not in a browser platform.
   */
  private init(): BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | undefined {
    if (RecaptchaLoaderService.ready) {
      return RecaptchaLoaderService.ready;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }

    const subject = new BehaviorSubject<ReCaptchaV2.ReCaptcha | null>(null);
    RecaptchaLoaderService.ready = subject;

    loader.newLoadScript({
      v3SiteKey: this.v3SiteKey,
      onBeforeLoad: (url) => {
        if (this.options?.onBeforeLoad) {
          return this.options.onBeforeLoad(url);
        }

        const newUrl = new URL(this.baseUrl ?? url);

        if (this.language) {
          newUrl.searchParams.set('hl', this.language);
        }

        return {
          url: newUrl,
          nonce: this.nonce,
        };
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
