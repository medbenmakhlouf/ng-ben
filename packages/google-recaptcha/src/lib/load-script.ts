import { RecaptchaLoaderOptions } from './tokens';

declare global {
  interface Window {
    ng2recaptchaloaded?(): void;
  }
}

export type RenderMode = 'explicit' | { key: string };

/**
 *
 * @param renderMode
 * @param onBeforeLoad
 * @param onLoaded
 * @param root0
 * @param root0.url
 * @param root0.lang
 * @param root0.nonce
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
 * @param root0
 * @param root0.v3SiteKey
 * @param root0.onBeforeLoad
 * @param root0.onLoaded
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
