import { PLATFORM_ID, type Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { MockGrecaptcha } from './mock-grecaptcha.spec';
import { type OnExecuteData, type OnExecuteErrorData } from '../types';
import { loader } from '../load-script';
import { RecaptchaLoaderService } from '../recaptcha-loader.service';
import { ReCaptchaV3Service } from '../recaptcha-v3.service';
import { RECAPTCHA_V3_SITE_KEY } from '../tokens';

/**
 *
 */
async function nextTick() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ReCaptchaV3Service', () => {
  let loadScriptStub: jasmine.Spy;
  beforeEach(() => {
    loadScriptStub = spyOn(loader, 'loadScript').and.callThrough();
  });

  afterEach(() => {
    // @ts-expect-error we need to reset the class after each test
    delete RecaptchaLoaderService.ready;
  });

  /**
   * Handles the loading of the grecaptcha script.
   * @param {MockGrecaptcha} grecaptcha - The mock grecaptcha instance.
   */
  function onGrecaptchaLoad(grecaptcha: MockGrecaptcha) {
    expect(loadScriptStub).toHaveBeenCalledTimes(1);
    const loadArgs = loadScriptStub.calls.mostRecent().args as Parameters<(typeof loader)['loadScript']>;
    loadArgs[0]?.onLoaded(grecaptcha);
  }

  /**
   * Initializes the service with additional providers.
   * @param {Provider[]} additionalProviders - Additional providers to configure the service.
   * @returns {ReCaptchaV3Service} The initialized ReCaptchaV3Service instance.
   */
  function initService(additionalProviders: Provider[] = []) {
    TestBed.configureTestingModule({
      providers: [
        { provide: RecaptchaLoaderService, useClass: RecaptchaLoaderService } as Provider,
        ReCaptchaV3Service,
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: 'testSikeKeyV3' },
        ...additionalProviders,
      ],
    });
    return TestBed.inject(ReCaptchaV3Service);
  }

  it('should load grecaptcha upon initialization', () => {
    // Arrange
    initService();

    // Act

    // Assert
    expect(loadScriptStub).toHaveBeenCalled();
  });

  it('should not load grecaptcha upon initialization if it is already present', () => {
    // Arrange
    const mockGrecaptchaValue = new MockGrecaptcha();
    // @ts-expect-error This is simulating an already loaded `grecaptcha`, but messing with component internals
    RecaptchaLoaderService.ready = new BehaviorSubject(mockGrecaptchaValue);
    initService();

    // Act

    // Assert
    expect(loadScriptStub).not.toHaveBeenCalled();
  });

  it('should not load grecaptcha upon initialization in non-browser environment', () => {
    // Arrange
    initService([
      {
        provide: PLATFORM_ID,
        useValue: {},
      },
    ]);

    // Act

    // Assert
    expect(loadScriptStub).not.toHaveBeenCalled();
  });

  it('should not fail execution in non-browser environment', () => {
    // Arrange
    const service = initService([
      {
        provide: PLATFORM_ID,
        useValue: {},
      },
    ]);

    // Act

    // Assert
    expect(() => service.execute('test action')).not.toThrow();
  });

  it('should invoke grecaptcha.execute with correct parameters', () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    onGrecaptchaLoad(mockGrecaptcha);

    // Act
    service.execute('test action');

    // Assert
    expect(mockGrecaptcha.execute).toHaveBeenCalledWith('testSikeKeyV3', {
      action: 'test action',
    });
  });

  it('should return observable value upon execution success', async () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    onGrecaptchaLoad(mockGrecaptcha);

    // Act
    let executionResult: string;
    service.execute('test action').subscribe((value) => (executionResult = value));
    mockGrecaptcha.executionFulfil('test action', 'test value');
    await nextTick();

    // Assert
    expect(executionResult!).toEqual('test value');
  });

  it('should complete observable upon execution success', async () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    onGrecaptchaLoad(mockGrecaptcha);

    // Act
    let isComplete = false;
    service.execute('test action').subscribe({
      complete() {
        isComplete = true;
      },
    });
    mockGrecaptcha.executionFulfil('test action', 'test value');
    await nextTick();

    // Assert
    expect(isComplete).toBeTrue();
  });

  it('should return execution value via onExecute observable', async () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    onGrecaptchaLoad(mockGrecaptcha);
    let executionResult: OnExecuteData;
    service.onExecute.subscribe((value) => (executionResult = value));

    // Act
    service.execute('test action');
    mockGrecaptcha.executionFulfil('test action', 'test value');
    await nextTick();

    // Assert
    expect(executionResult!).toEqual({
      action: 'test action',
      token: 'test value',
    });
  });

  it('should not re-create onExecute observable on subsequent invocations', () => {
    // Arrange
    const service = initService();

    // Act
    const ref1 = service.onExecute;
    const ref2 = service.onExecute;

    // Assert
    expect(ref1 === ref2).toBeTrue();
  });

  it('should return error reason upon execution failure', async () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    onGrecaptchaLoad(mockGrecaptcha);

    // Act
    let executionError: string;
    service.execute('test action').subscribe(
      () => void 0,
      (error) => (executionError = error as string),
    );
    mockGrecaptcha.executionReject('test action', 'test error');
    await nextTick();

    // Assert
    expect(executionError!).toEqual('test error');
  });

  it('should return error reason upon grecaptcha.execute failure', async () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    onGrecaptchaLoad(mockGrecaptcha);
    mockGrecaptcha.execute.and.throwError(new Error('test error'));

    // Act
    let executionError: Error;
    service.execute('test action').subscribe(
      () => void 0,
      (error) => (executionError = error as Error),
    );
    await nextTick();

    // Assert
    expect(executionError!).toBeTruthy();
    expect(executionError!.message).toEqual('test error');
  });

  it('should return execution error reason via onExecuteError observable', async () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    onGrecaptchaLoad(mockGrecaptcha);
    let executionResult: OnExecuteErrorData;
    service.onExecuteError.subscribe((value) => (executionResult = value));

    // Act
    service.execute('test action');
    mockGrecaptcha.executionReject('test action', 'test rejection value');
    await nextTick();

    // Assert
    expect(executionResult!).toEqual({
      action: 'test action',
      error: 'test rejection value',
    });
  });

  it('should not re-create onExecuteError observable on subsequent invocations', () => {
    // Arrange
    const service = initService();

    // Act
    const ref1 = service.onExecuteError;
    const ref2 = service.onExecuteError;

    // Assert
    expect(ref1 === ref2).toBeTrue();
  });

  it('should execute actions even if grecaptcha was not yet loaded at the time of invocation', async () => {
    // Arrange
    const service = initService();
    const mockGrecaptcha = new MockGrecaptcha();
    let executionResult1: string;
    service.execute('test action 1').subscribe((value) => (executionResult1 = value));
    let executionResult2: string;
    service.execute('test action 2').subscribe((value) => (executionResult2 = value));

    // Act
    onGrecaptchaLoad(mockGrecaptcha);
    mockGrecaptcha.executionFulfil('test action 1', 'test value 1');
    mockGrecaptcha.executionFulfil('test action 2', 'test value 2');
    await nextTick();

    // Assert
    expect(executionResult1!).toEqual('test value 1');
    expect(executionResult2!).toEqual('test value 2');
  });
});
