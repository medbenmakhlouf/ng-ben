import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockRecaptchaLoaderService } from './mock-recaptcha-loader.service.spec';
import { RecaptchaLoaderService } from './recaptcha-loader.service';
import { RecaptchaSettings } from './recaptcha-settings';
import { RecaptchaComponent, RecaptchaErrorParameters } from './recaptcha.component';
import { RECAPTCHA_SETTINGS } from './tokens';

describe('RecaptchaComponent', () => {
  let component: RecaptchaComponent;
  let fixture: ComponentFixture<RecaptchaComponent>;
  let mockRecaptchaLoaderService: MockRecaptchaLoaderService;

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
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    component.reset();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).not.toHaveBeenCalled();
  });

  it('should reset grecaptcha if it has loaded', () => {
    // Arrange
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    component.reset();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).toHaveBeenCalled();
  });

  it('should emit null value upon grecaptcha reset if it has been resolved prior to that', () => {
    // Arrange
    const emittedResponses: (string | null)[] = [];
    component.resolved.subscribe((response: string | null) => emittedResponses.push(response));
    mockRecaptchaLoaderService.init();

    // Act
    fixture.detectChanges();
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();
    component.reset();
    fixture.detectChanges();

    // Assert
    expect(emittedResponses).toEqual(['test response', null]);
  });

  it('should emit grecaptcha value through resolved event emitter', () => {
    // Arrange
    const emittedResponses: (string | null)[] = [];
    component.resolved.subscribe((response: string | null) => emittedResponses.push(response));
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
    component.resolved.subscribe((response: string | null) => emittedResponses.push(response));
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
    component.errored.subscribe((error: RecaptchaErrorParameters) => emittedErrors.push(error));
    component.errorMode = 'handled';
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
    component.execute();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.execute).not.toHaveBeenCalled();
  });

  it("should invoke grecaptcha.execute if size was set to 'invisible'", () => {
    // Arrange
    mockRecaptchaLoaderService.init();
    component.size = 'invisible';

    // Act
    fixture.detectChanges();
    component.execute();
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.execute).toHaveBeenCalled();
  });

  it('should invoke grecaptcha.execute even if grecaptcha has not yet loaded at the time of invocation', () => {
    // Arrange
    component.size = 'invisible';

    // Act
    fixture.detectChanges();
    component.execute();
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
    component.ngOnDestroy();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).toHaveBeenCalled();
  });
});

describe('RecaptchaComponent initialization', () => {
  // Arrange
  let mockRecaptchaLoaderService: MockRecaptchaLoaderService;

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
    // Assert
    expect(fixture.componentInstance.badge).toEqual('bottomleft');
    expect(fixture.componentInstance.siteKey).toEqual('test site key');
    expect(fixture.componentInstance.size).toEqual('compact');
    expect(fixture.componentInstance.theme).toEqual('dark');
    expect(fixture.componentInstance.type).toEqual('audio');
  });

  it('should gracefully handle destroying of the component if initialization has not finished', () => {
    // Act
    const fixture = TestBed.createComponent(RecaptchaComponent);
    fixture.detectChanges();
    // Act + Assert
    expect(() => fixture.componentInstance.ngOnDestroy()).not.toThrow();
  });
});
