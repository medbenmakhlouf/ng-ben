import { ScriptLoaderOptions } from './types';

declare global {
  interface Window {
    ng2recaptchaloaded?(): void;
  }
}

/**
 * Loads the ReCaptcha script with the specified options.
 * @param {ScriptLoaderOptions} options - The options for loading the script.
 * @returns {void}
 */
function loadScript(options: ScriptLoaderOptions): void {
  window.ng2recaptchaloaded = () => {
    options.onLoaded(grecaptcha);
  };
  const script = document.createElement('script');
  const { url: baseUrl, nonce: onBeforeLoadNonce } = options.onBeforeLoad(
    new URL('https://www.google.com/recaptcha/api.js'),
  );
  baseUrl.searchParams.set('render', options.renderMode === 'explicit' ? options.renderMode : options.renderMode.key);
  baseUrl.searchParams.set('onload', 'ng2recaptchaloaded');
  baseUrl.searchParams.set('trustedtypes', 'true');
  if (onBeforeLoadNonce) {
    script.setAttribute('nonce', onBeforeLoadNonce);
  }
  script.innerHTML = '';
  script.src = baseUrl.href;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export const loader = { loadScript };
