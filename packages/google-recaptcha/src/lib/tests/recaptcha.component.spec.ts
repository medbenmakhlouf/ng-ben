import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockRecaptchaLoaderService } from './mock-recaptcha-loader.service.spec';
import { RecaptchaErrorParameters, RecaptchaSettings } from '../types';
import { RecaptchaLoaderService } from '../recaptcha-loader.service';
import { RecaptchaComponent } from '../recaptcha.component';
import { RecaptchaDirective } from '../recaptcha.directive';
import { RECAPTCHA_SETTINGS } from '../tokens';

describe('RecaptchaComponent', () => {
  let fixture: ComponentFixture<RecaptchaComponent>;
  let componentRef: ComponentRef<RecaptchaComponent>;
  let mockRecaptchaLoaderService: MockRecaptchaLoaderService;
  let directive: RecaptchaDirective;

  beforeEach(async () => {
    mockRecaptchaLoaderService = new MockRecaptchaLoaderService();
    await TestBed.configureTestingModule({
      imports: [RecaptchaComponent],
      providers: [
        {
          provide: RecaptchaLoaderService,
          useValue: mockRecaptchaLoaderService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecaptchaComponent);
    componentRef = fixture.componentRef;
    fixture.detectChanges();
    directive = fixture.debugElement.injector.get(RecaptchaDirective);
  });

  it('should render recaptcha once loader is done', () => {
    // Arrange
    expect(mockRecaptchaLoaderService.grecaptchaMock.render).not.toHaveBeenCalled();
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.render).toHaveBeenCalled();
  });

  it('should not reset grecaptcha if it has not loaded yet', () => {
    // Arrange
    // Act
    directive.reset();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).not.toHaveBeenCalled();
  });

  it('should reset grecaptcha if it has loaded', () => {
    // Arrange
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    directive.reset();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).toHaveBeenCalled();
  });

  it('should emit null value upon grecaptcha reset if it has been resolved prior to that', () => {
    // Arrange
    const emittedResponses: (string | null)[] = [];
    directive.resolved.subscribe((response: string | null) => emittedResponses.push(response));
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();
    directive.reset();
    fixture.detectChanges();

    // Assert
    expect(emittedResponses).toEqual(['test response', null]);
  });

  it('should emit grecaptcha value through resolved event emitter', () => {
    // Arrange
    const emittedResponses: (string | null)[] = [];
    directive.resolved.subscribe((response: string | null) => emittedResponses.push(response));
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');

    // Assert
    expect(emittedResponses).toEqual(['test response']);
  });

  it('should emit null value through resolved event emitter once grecaptcha expires', () => {
    // Arrange
    const emittedResponses: (string | null)[] = [];
    directive.resolved.subscribe((response: string | null) => emittedResponses.push(response));
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();
    mockRecaptchaLoaderService.grecaptchaMock.expireGrecaptchaResponse();

    // Assert
    expect(emittedResponses).toEqual(['test response', null]);
  });

  it("should emit grecaptcha error if errorMode was set to 'handled'", () => {
    // Arrange
    const emittedErrors: RecaptchaErrorParameters[] = [];
    directive.errored.subscribe((error: RecaptchaErrorParameters) => emittedErrors.push(error));
    componentRef.setInput('errorMode', 'handled');
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaError();

    // Assert
    expect(emittedErrors).toHaveSize(1);
  });

  it("should not provide 'error-callback' to grecaptcha errorMode was not set to 'handled'", () => {
    // Arrange
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();

    // Assert
    mockRecaptchaLoaderService.grecaptchaMock.expectNoErrorCallback();
  });

  it("should not execute grecaptcha if size was not set to 'invisible'", () => {
    // Arrange
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    directive.execute();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.execute).not.toHaveBeenCalled();
  });

  it("should invoke grecaptcha.execute if size was set to 'invisible'", () => {
    // Arrange
    mockRecaptchaLoaderService.init();
    componentRef.setInput('size', 'invisible');

    // Act
    fixture.detectChanges();
    directive.execute();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.execute).toHaveBeenCalled();
  });

  it('should invoke grecaptcha.execute even if grecaptcha has not yet loaded at the time of invocation', () => {
    // Arrange
    componentRef.setInput('size', 'invisible');

    // Act
    fixture.detectChanges();
    directive.execute();
    fixture.detectChanges();
    mockRecaptchaLoaderService.init();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.execute).toHaveBeenCalled();
  });

  it('should reset grecaptcha when the component is destroyed', () => {
    // Arrange
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    directive.onDestroy();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).toHaveBeenCalled();
  });
});

describe('RecaptchaComponent initialization', () => {
  // Arrange
  let mockRecaptchaLoaderService: MockRecaptchaLoaderService;
  let directive: RecaptchaDirective;
  beforeEach(async () => {
    mockRecaptchaLoaderService = new MockRecaptchaLoaderService();
    const recaptchaSettings: RecaptchaSettings = {
      badge: 'bottomleft',
      siteKey: 'test site key',
      size: 'compact',
      theme: 'dark',
      type: 'audio',
    };
    await TestBed.configureTestingModule({
      imports: [RecaptchaComponent],
      providers: [
        {
          provide: RecaptchaLoaderService,
          useValue: mockRecaptchaLoaderService,
        },
        {
          provide: RECAPTCHA_SETTINGS,
          useValue: recaptchaSettings,
        },
      ],
    }).compileComponents();
  });

  it('should default input values to RECAPTCHA_SETTINGS injection token if it was provided', () => {
    // Act
    const fixture = TestBed.createComponent(RecaptchaComponent);
    fixture.detectChanges();
    directive = fixture.debugElement.injector.get(RecaptchaDirective);
    // Assert
    expect(directive.badge()).toEqual('bottomleft');
    expect(directive.siteKey()).toEqual('test site key');
    expect(directive.size()).toEqual('compact');
    expect(directive.theme()).toEqual('dark');
    expect(directive.type()).toEqual('audio');
  });

  it('should gracefully handle destroying of the component if initialization has not finished', () => {
    // Act
    const fixture = TestBed.createComponent(RecaptchaComponent);
    fixture.detectChanges();
    directive = fixture.debugElement.injector.get(RecaptchaDirective);
    // Act + Assert
    expect(() => directive.onDestroy()).not.toThrow();
  });
});
