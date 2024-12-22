/* eslint-disable jsdoc/no-undefined-types */
import { NgModule, PLATFORM_ID, type Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { MockGrecaptcha } from './mock-grecaptcha.spec';
import { type RecaptchaLoaderOptions } from '../types';

import { loader } from '../load-script';
import { RECAPTCHA_LOADER_OPTIONS, RECAPTCHA_V3_SITE_KEY } from '../tokens';
import { RecaptchaLoaderService } from '../recaptcha-loader.service';

describe('RecaptchaLoaderService', () => {
  let loadScriptStub: jasmine.Spy;
  let scriptAppendSpy: jasmine.Spy;
  beforeEach(() => {
    loadScriptStub = spyOn(loader, 'loadScript').and.callThrough();
    scriptAppendSpy = spyOn(document.head, 'appendChild').and.stub();
  });

  afterEach(() => {
    // @ts-expect-error we are deliberately resetting this to allow for better unit test isolation
    RecaptchaLoaderService.ready = null;
  });

  /**
   * Retrieves the parameters of the most recently appended script tag.
   * @returns {object} An object containing the script tag, script URL, and script URL search parameters.
   */
  function getMockLoadScriptParams() {
    expect(scriptAppendSpy).toHaveBeenCalledTimes(1);

    const scriptTag = scriptAppendSpy.calls.mostRecent().args[0] as HTMLScriptElement;
    const scriptUrl = new URL(scriptTag.src);
    const scriptUrlSearchParams = new URLSearchParams(scriptUrl.searchParams);

    return {
      scriptTag,
      scriptUrl,
      scriptUrlSearchParams,
    };
  }

  /**
   * Simulates the script loading process.
   * @param {RecaptchaLoaderService} service - The RecaptchaLoaderService instance.
   * @param {MockGrecaptcha} mockGrecaptchaValue - The mock grecaptcha value.
   * @returns {ReCaptchaV2.ReCaptcha} The resolved ReCaptcha instance.
   */
  function simulateScriptLoaded(
    service: RecaptchaLoaderService,
    mockGrecaptchaValue: MockGrecaptcha,
  ): ReCaptchaV2.ReCaptcha {
    let resolvedValue: ReCaptchaV2.ReCaptcha | null = null;
    service.ready.subscribe((value) => (resolvedValue = value));

    // Act
    const callArgs = loadScriptStub.calls.mostRecent().args as Parameters<(typeof loader)['loadScript']>;
    callArgs[0]?.onLoaded(mockGrecaptchaValue);

    return resolvedValue!;
  }

  /**
   * Initializes the RecaptchaLoaderService with additional providers.
   * @param {Provider[]} additionalProviders - Additional providers to configure the service.
   * @returns {RecaptchaLoaderService} The initialized RecaptchaLoaderService instance.
   */
  function initService(additionalProviders: Provider[] = []) {
    TestBed.configureTestingModule({
      providers: [RecaptchaLoaderService, ...additionalProviders],
    });
    return TestBed.inject(RecaptchaLoaderService);
  }

  it("should have a 'ready' observable", () => {
    // Arrange
    const service = initService();

    // Act

    // Assert
    expect(service.ready).not.toBeNull();
    expect(service.ready).toBeInstanceOf(Observable);
  });

  it('should invoke script loader upon initialization', () => {
    // Arrange
    initService();

    // Act

    // Assert
    expect(loader.loadScript).toHaveBeenCalled();
  });

  it('should invoke script loader with v3 site key if provided', () => {
    // Arrange
    initService([
      {
        provide: RECAPTCHA_V3_SITE_KEY,
        useValue: 'testSiteKeyV3',
      },
    ]);

    // Act
    const { scriptUrlSearchParams } = getMockLoadScriptParams();

    // Assert
    expect(scriptUrlSearchParams.get('render')).toEqual('testSiteKeyV3');
  });

  it('should not invoke script loader if platform is not browser', () => {
    // Arrange
    initService([
      {
        provide: PLATFORM_ID,
        useValue: {},
      },
    ]);

    // Act

    // Assert
    expect(loader.loadScript).not.toHaveBeenCalled();
  });

  it('should emit grecaptcha through observable after script loading finished', () => {
    // Arrange
    const service = initService();
    const mockGrecaptchaValue = new MockGrecaptcha();

    // Act
    const resolvedRecaptcha = simulateScriptLoaded(service, mockGrecaptchaValue);

    // Assert
    expect(resolvedRecaptcha).toBeTruthy();
    expect(resolvedRecaptcha).toEqual(mockGrecaptchaValue);
  });

  it('should not invoke script loader more than once if service was created multiple times through different modules', () => {
    // Arrange
    let service1: RecaptchaLoaderService | undefined = undefined;
    let service2: RecaptchaLoaderService | undefined = undefined;
    @NgModule({
      providers: [
        {
          provide: RecaptchaLoaderService,
          useFactory() {
            service1 = new RecaptchaLoaderService();
            return service1;
          },
          multi: true,
        },
      ],
    })
    class TestModule1 {}
    TestBed.configureTestingModule({
      imports: [TestModule1],
      providers: [
        {
          provide: RecaptchaLoaderService,
          useFactory() {
            service2 = new RecaptchaLoaderService();
            return service2;
          },
          multi: true,
        },
      ],
    });

    // Act
    TestBed.inject(RecaptchaLoaderService);

    // Assert
    expect(service1).toBeTruthy();
    expect(service2).toBeTruthy();
    expect(service1 !== service2).toBeTrue();
    expect(loader.loadScript).toHaveBeenCalledTimes(1);
  });

  describe('RecaptchaLoaderOptions', () => {
    it('should load the script with nonce from onBeforeLoad', () => {
      // Arrange
      initService([
        {
          provide: RECAPTCHA_LOADER_OPTIONS,
          useValue: {
            onBeforeLoad(url) {
              return { url, nonce: 'test-nonce' };
            },
          } as RecaptchaLoaderOptions,
        },
      ]);

      // Act
      const { scriptTag } = getMockLoadScriptParams();

      // Assert
      expect(scriptTag.nonce).toEqual('test-nonce');
    });

    it('should load the script with nonce from onBeforeLoad even if RECAPTCHA_NONCE was provided', () => {
      // Arrange
      initService([
        {
          provide: RECAPTCHA_LOADER_OPTIONS,
          useValue: {
            onBeforeLoad(url) {
              return { url, nonce: 'test-nonce' };
            },
          } as RecaptchaLoaderOptions,
        },
      ]);

      // Act
      const { scriptTag } = getMockLoadScriptParams();

      // Assert
      expect(scriptTag.nonce).toEqual('test-nonce');
    });

    it('should load the script with the url from onBeforeLoad', () => {
      // Arrange
      initService([
        {
          provide: RECAPTCHA_LOADER_OPTIONS,
          useValue: {
            onBeforeLoad() {
              return {
                url: new URL('https://test-url/test-api.js?testParam=yes'),
              };
            },
          } as RecaptchaLoaderOptions,
        },
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: 'testSiteKeyV3',
        } as Provider,
      ]);

      // Act
      const { scriptUrl, scriptUrlSearchParams } = getMockLoadScriptParams();

      // Assert
      expect(scriptUrl.protocol).toEqual('https:');
      expect(scriptUrl.hostname).toEqual('test-url');
      expect(scriptUrl.pathname).toEqual('/test-api.js');
      expect(scriptUrlSearchParams.get('render')).toEqual('testSiteKeyV3');
      expect(scriptUrlSearchParams.get('testParam')).toEqual('yes');
    });

    it('should load the script with the url from onBeforeLoad even if RECAPTCHA_BASE_URL was provided', () => {
      // Arrange
      initService([
        {
          provide: RECAPTCHA_LOADER_OPTIONS,
          useValue: {
            onBeforeLoad() {
              return {
                url: new URL('https://test-url/test-api.js?testParam=yes'),
              };
            },
          } as RecaptchaLoaderOptions,
        },
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: 'testSiteKeyV3',
        } as Provider,
      ]);

      // Act
      const { scriptUrl, scriptUrlSearchParams } = getMockLoadScriptParams();

      // Assert
      expect(scriptUrl.protocol).toEqual('https:');
      expect(scriptUrl.hostname).toEqual('test-url');
      expect(scriptUrl.pathname).toEqual('/test-api.js');
      expect(scriptUrlSearchParams.get('render')).toEqual('testSiteKeyV3');
      expect(scriptUrlSearchParams.get('testParam')).toEqual('yes');
    });

    it('should load the script with the lang param from onBeforeLoad even if RECAPTCHA_LANGUAGE was explicitly provided', () => {
      // Arrange
      initService([
        {
          provide: RECAPTCHA_LOADER_OPTIONS,
          useValue: {
            onBeforeLoad(url) {
              url.searchParams.set('hl', 'test-lang');

              return { url };
            },
          } as RecaptchaLoaderOptions,
        },
      ]);

      // Act
      const { scriptUrl, scriptUrlSearchParams } = getMockLoadScriptParams();

      // Assert
      expect(scriptUrl.protocol).toEqual('https:');
      expect(scriptUrl.hostname).toEqual('www.google.com');
      expect(scriptUrl.pathname).toEqual('/recaptcha/api.js');
      expect(scriptUrlSearchParams.get('render')).toEqual('explicit');
      expect(scriptUrlSearchParams.get('hl')).toEqual('test-lang');
    });

    it('should load the original ReCaptchaV2.Recaptcha if `onLoad` is not provided', () => {
      // Arrange
      const mockRecaptcha = new MockGrecaptcha();
      const service = initService([
        {
          provide: RECAPTCHA_LOADER_OPTIONS,
          useValue: {} as RecaptchaLoaderOptions,
        },
      ]);

      // Act
      const resolvedRecaptcha = simulateScriptLoaded(service, mockRecaptcha);

      // Assert
      expect(resolvedRecaptcha).toBeDefined();
      expect(resolvedRecaptcha).toEqual(mockRecaptcha);
    });

    it('should load the ReCaptchaV2.Recaptcha based on the value returned from `onLoad`', () => {
      // Arrange
      const mockRecaptcha = new MockGrecaptcha();
      const mockRecaptchaEnterprise = new MockGrecaptcha();
      const service = initService([
        {
          provide: RECAPTCHA_LOADER_OPTIONS,
          useValue: {
            onLoaded(recaptcha) {
              if (recaptcha === mockRecaptcha) {
                return mockRecaptchaEnterprise;
              }

              return new MockGrecaptcha();
            },
          } as RecaptchaLoaderOptions,
        },
      ]);

      // Act
      const resolvedRecaptcha = simulateScriptLoaded(service, mockRecaptcha);

      // Assert
      expect(resolvedRecaptcha).toBeDefined();
      expect(resolvedRecaptcha).not.toEqual(mockRecaptcha);
      expect(resolvedRecaptcha).toEqual(mockRecaptchaEnterprise);
    });
  });
});
