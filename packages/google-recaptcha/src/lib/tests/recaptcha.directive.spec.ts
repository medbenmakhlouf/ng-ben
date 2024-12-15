import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DebugElement, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { MockRecaptchaLoaderService } from './mock-recaptcha-loader.service.spec';
import { RecaptchaLoaderService } from '../recaptcha-loader.service';
import { RecaptchaDirective } from '../recaptcha.directive';
import { RecaptchaComponent } from '../recaptcha.component';

describe('RecaptchaValueAccessorDirective -> [(ngModel)]', () => {
  @Component({
    template: `
      <form #captchaForm="ngForm">
        <google-recaptcha [(ngModel)]="formModel.captcha" name="captcha" #captcha="ngModel"></google-recaptcha>
        @if (captcha.pristine) {
          <div captcha-pristine></div>
        }
      </form>
    `,
    imports: [RecaptchaComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {
    public formModel: { captcha: WritableSignal<string | null> } = { captcha: signal(null) };
  }
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestComponent>;
  let mockRecaptchaLoaderService: MockRecaptchaLoaderService;

  beforeEach(async () => {
    mockRecaptchaLoaderService = new MockRecaptchaLoaderService();
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: RecaptchaLoaderService,
          useValue: mockRecaptchaLoaderService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    mockRecaptchaLoaderService.init();
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should consider form control pristine initially', () => {
    // Arrange

    // Act

    // Assert
    expect(fixture.debugElement.queryAll(By.css('[captcha-pristine]'))).toHaveSize(1);
  });

  it('should consider form control dirty after it has been resolved', () => {
    // Arrange

    // Act
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.formModel.captcha()).toEqual('test response');
    expect(fixture.debugElement.queryAll(By.css('[captcha-pristine]'))).toHaveSize(0);
  });

  it('should be able to reset grecaptcha control using falsy value after it has been resolved', async () => {
    // Arrange

    // Act
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();

    mockRecaptchaLoaderService.grecaptchaMock.reset.calls.reset();
    fixture.componentInstance.formModel.captcha.set('');
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).toHaveBeenCalled();
  });

  it('should not reset grecaptcha control upon setting form control value to a truthy value', () => {
    // Arrange

    // Act
    mockRecaptchaLoaderService.grecaptchaMock.reset.calls.reset();
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();
    fixture.componentInstance.formModel.captcha.set('some value');
    fixture.detectChanges();

    // Assert
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).not.toHaveBeenCalled();
  });

  it("should not fail if 'onResolve' is invoked prior to callbacks being registered", () => {
    // Arrange
    debugElement = fixture.debugElement.query(By.directive(RecaptchaDirective));
    const directive = debugElement.injector.get(RecaptchaDirective);
    // Act + Assert
    expect(() => directive.onResolve('test value')).not.toThrow();
  });
});

describe('RecaptchaValueAccessorDirective -> formGroup', () => {
  @Component({
    template: `
      @if ((loading$ | async) === false) {
        <form [formGroup]="formGroup">
          <google-recaptcha formControlName="captcha"></google-recaptcha>
        </form>
      }
    `,
    imports: [RecaptchaComponent, ReactiveFormsModule, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {
    public loading$ = new BehaviorSubject<boolean>(false);
    public formGroup = new UntypedFormGroup({
      captcha: new UntypedFormControl(null, [Validators.required]),
    });

    public testHideForm(): void {
      this.loading$.next(true);
    }

    public testShowForm(): void {
      this.loading$.next(false);
    }

    public testSetCaptchaControlValue(value: string | null): void {
      this.formGroup.setValue({ captcha: value });
    }

    public testGetCaptchaControlValue(): string | null {
      return this.formGroup.controls['captcha'].value;
    }
  }

  let fixture: ComponentFixture<TestComponent>;
  let mockRecaptchaLoaderService: MockRecaptchaLoaderService;

  beforeEach(async () => {
    mockRecaptchaLoaderService = new MockRecaptchaLoaderService();
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: RecaptchaLoaderService,
          useValue: mockRecaptchaLoaderService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    mockRecaptchaLoaderService.init();
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should not try to reset the component if it has been destroyed already', () => {
    // Arrange
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();

    // Act
    fixture.componentInstance.testHideForm();
    fixture.detectChanges();

    expect(fixture.componentInstance.testGetCaptchaControlValue()).toEqual('test response');
    mockRecaptchaLoaderService.grecaptchaMock.reset.calls.reset(); // the "onDestroy" resets the captcha

    fixture.componentInstance.testSetCaptchaControlValue(null);
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.testGetCaptchaControlValue()).toBeFalsy();
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).not.toHaveBeenCalled();
  });

  it('should reset the host if the control value written does not represent grecaptcha state', () => {
    // Arrange
    mockRecaptchaLoaderService.grecaptchaMock.emitGrecaptchaResponse('test response');
    fixture.detectChanges();

    // Act
    fixture.componentInstance.testHideForm();
    fixture.detectChanges();
    expect(fixture.componentInstance.testGetCaptchaControlValue()).toEqual('test response');
    fixture.componentInstance.testShowForm();
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.testGetCaptchaControlValue()).toBeFalsy();
    expect(mockRecaptchaLoaderService.grecaptchaMock.reset).toHaveBeenCalled();
  });
});
