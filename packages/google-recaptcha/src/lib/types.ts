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

export type NeverUndefined<T> = T extends undefined ? never : T;
export type RecaptchaErrorParameters = Parameters<NeverUndefined<ReCaptchaV2.Parameters['error-callback']>>;
export type RenderMode = 'explicit' | { key: string };
