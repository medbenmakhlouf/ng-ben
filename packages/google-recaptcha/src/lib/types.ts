import { type Subject } from 'rxjs';

export interface RecaptchaSettings {
  siteKey?: string;
  theme?: ReCaptchaV2.Theme;
  type?: ReCaptchaV2.Type;
  size?: ReCaptchaV2.Size;
  badge?: ReCaptchaV2.Badge;
}

export interface OnExecuteData {
  /**
   * The name of the action that has been executed.
   */
  action: string;
  /**
   * The token that reCAPTCHA v3 provided when executing the action.
   */
  token: string;
}

export interface OnExecuteErrorData {
  /**
   * The name of the action that has been executed.
   */
  action: string;
  /**
   * The error which was encountered
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

type NeverUndefined<T> = T extends undefined ? never : T;
export type RecaptchaErrorParameters = Parameters<NeverUndefined<ReCaptchaV2.Parameters['error-callback']>>;
export type ActionBacklogEntry = [string, Subject<string>];

/**
 * Specifies the options for loading the reCAPTCHA script tag.
 */
export interface RecaptchaLoaderOptions {
  /**
   * Invoked before the `<script>` tag is appended to the DOM.
   * Use this function as an opportunity to set `nonce`, as well as modify the URL of the tag.
   *
   * Use the `url.searchParams` to set additional query string attributes (including reCAPTCHA language),
   * or use an entirely different base URL altogether.
   *
   * The URL that you provide will then properly set the `"render"` and `"onload"` attributes which are required for proper `ng-recaptcha` wire-up.
   * @param url the current URL that was composed. Either modify it in-place, or return a completely new URL.
   * @returns the final URL that is going to be used as the `src` for the `<script>` tag, along with (optionally) a nonce.
   * @example
   * Provide nonce:
   * ```ts
   * {
   *    provide: RECAPTCHA_LOADER_OPTIONS,
   *    useValue: {
   *      onBeforeLoad(url) {
   *        return {
   *          url,
   *          nonce: "YOUR_NONCE"
   *        };
   *      }
   *    }
   * }
   * ```
   *
   * Set the reCAPTCHA language:
   * ```ts
   * {
   *    provide: RECAPTCHA_LOADER_OPTIONS,
   *    useValue: {
   *      onBeforeLoad(url) {
   *        url.searchParams.set("hl", "en-GB")
   *
   *        return { url };
   *      }
   *    }
   * }
   * ```
   *
   * Use a different base URL for loading reCAPTCHA
   * ```ts
   * {
   *    provide: RECAPTCHA_LOADER_OPTIONS,
   *    useValue: {
   *      onBeforeLoad(_url) {
   *        const chinaCompatibleUrl = new URL("https://www.recaptcha.net/recaptcha/api.js");
   *        // optionally, set the locale:
   *        // chinaCompatibleUrl.searchParams.set("hl", "zh-CN");
   *
   *        return {
   *          url: chinaCompatibleUrl
   *        };
   *      }
   *    }
   * }
   * ```
   */
  onBeforeLoad?(url: URL): { url: URL; nonce?: string | null };

  /**
   * Allows you to change the `grecaptcha` that the `ng-recaptcha` will be relying on.
   * This method is useful when you need to use `grecaptcha.enterprise` instead of the base `grecaptcha`
   * @param recaptcha the value of `window.grecaptcha` upon script load.
   * @returns the {ReCaptchaV2.ReCaptcha} instance that the `ng-recaptcha` lib will use.
   * @example
   * Using the Enterprise version of `grecaptcha`:
   *
   * ```ts
   * {
   *    provide: RECAPTCHA_LOADER_OPTIONS,
   *    useValue: {
   *      onBeforeLoad() {
   *        const recaptchaEnterpriseUrl = new URL("https://www.google.com/recaptcha/enterprise.js");
   *        // optionally, if you're using the reCAPTCHA session-tokens, set the `&waf=session` param,
   *        // see https://cloud.google.com/recaptcha-enterprise/docs/implement-waf-ca#session-token
   *        // recaptchaEnterpriseUrl.searchParams.set("waf", "session");
   *
   *        return {
   *          url: recaptchaEnterpriseUrl,
   *        }
   *      },
   *      onLoaded(recaptcha) {
   *        return recaptcha.enterprise;
   *      }
   *    }
   * }
   * ```
   */
  onLoaded?(recaptcha: ReCaptchaV2.ReCaptcha): ReCaptchaV2.ReCaptcha;
}

export interface ScriptLoaderOptions {
  renderMode: 'explicit' | { key: string };
  onBeforeLoad(url: URL): { url: URL; nonce?: string | null };
  onLoaded(recaptcha: ReCaptchaV2.ReCaptcha): void;
}
