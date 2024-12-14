import { RecaptchaLoaderOptions } from './tokens';

declare global {
  interface Window {
    ng2recaptchaloaded?(): void;
  }
}

export type RenderMode = 'explicit' | { key: string };

/**
 *
 * @param {RenderMode} renderMode - The mode to render the reCAPTCHA.
 * @param {(url: URL) => { url: URL; nonce?: string }} onBeforeLoad - Function to call before loading the script.
 * @param {(grecaptcha: ReCaptchaV2.ReCaptcha) => void} onLoaded - Function to call when the script is loaded.
 * @param {{ url?: string; lang?: string; nonce?: string }} root0 - Additional options.
 * @param {string} [root0.url] - The URL to load the script from.
 * @param {string} [root0.lang] - The language code for the reCAPTCHA.
 * @param {string} [root0.nonce] - The nonce attribute for the script.
 */
function loadScript(
  renderMode: RenderMode,
  onBeforeLoad: (url: URL) => { url: URL; nonce?: string },
  onLoaded: (grecaptcha: ReCaptchaV2.ReCaptcha) => void,
  { url, lang, nonce }: { url?: string; lang?: string; nonce?: string } = {},
): void {
  window.ng2recaptchaloaded = () => {
    onLoaded(grecaptcha);
  };
  const script = document.createElement('script');
  script.innerHTML = '';

  const { url: baseUrl, nonce: onBeforeLoadNonce } = onBeforeLoad(
    new URL(url || 'https://www.google.com/recaptcha/api.js'),
  );
  baseUrl.searchParams.set('render', renderMode === 'explicit' ? renderMode : renderMode.key);
  baseUrl.searchParams.set('onload', 'ng2recaptchaloaded');
  baseUrl.searchParams.set('trustedtypes', 'true');
  if (lang) {
    baseUrl.searchParams.set('hl', lang);
  }

  script.src = baseUrl.href;

  const nonceValue = onBeforeLoadNonce || nonce;

  if (nonceValue) {
    script.setAttribute('nonce', nonceValue);
  }
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

/**
 *
 * @param {object} root0 - The options object.
 * @param {string} [root0.v3SiteKey] - The site key for reCAPTCHA v3.
 * @param {(url: URL) => { url: URL; nonce?: string }} root0.onBeforeLoad - Function to call before loading the script.
 * @param {(grecaptcha: ReCaptchaV2.ReCaptcha) => void} root0.onLoaded - Function to call when the script is loaded.
 */
function newLoadScript({
  v3SiteKey,
  onBeforeLoad,
  onLoaded,
}: { v3SiteKey: string | undefined; onLoaded(recaptcha: ReCaptchaV2.ReCaptcha): void } & Pick<
  Required<RecaptchaLoaderOptions>,
  'onBeforeLoad'
>) {
  const renderMode: RenderMode = v3SiteKey ? { key: v3SiteKey } : 'explicit';

  loader.loadScript(renderMode, onBeforeLoad, onLoaded);
}

export const loader = { loadScript, newLoadScript };
