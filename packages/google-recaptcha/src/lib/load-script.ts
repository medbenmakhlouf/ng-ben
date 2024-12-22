/* eslint-disable jsdoc/no-undefined-types */
import { ScriptLoaderOptions } from './types';

declare global {
  interface Window {
    ng2recaptchaloaded?(): void;
  }
}

/**
 *
 * @param {RenderMode} renderMode - The mode to render the reCAPTCHA.
 * @param {(url: URL) => { url: URL; nonce?: string }} onBeforeLoad - Function to call before loading the script.
 * @param {(grecaptcha: ReCaptchaV2.ReCaptcha) => void} onLoaded - Function to call when the script is loaded.
 * @param {{ url?: string; lang?: string; nonce?: string }} root0 - Additional options.
 * @param {string} [root0.url] - The URL to load the script from.
 * @param {string} [root0.lang] - The language code for the reCAPTCHA.
 * @param {string} [root0.nonce] - The nonce attribute for the script.
 * @param options
 */
function loadScript(
  options: ScriptLoaderOptions,
  { url, lang, nonce }: { url?: string; lang?: string; nonce?: string } = {},
): void {
  window.ng2recaptchaloaded = () => {
    options.onLoaded(grecaptcha);
  };
  const script = document.createElement('script');
  script.innerHTML = '';

  const { url: baseUrl, nonce: onBeforeLoadNonce } = options.onBeforeLoad(
    new URL(url || 'https://www.google.com/recaptcha/api.js'),
  );
  baseUrl.searchParams.set('render', options.renderMode === 'explicit' ? options.renderMode : options.renderMode.key);
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

export const loader = { loadScript };
