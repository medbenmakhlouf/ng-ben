import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type RecaptchaErrorParameters, RecaptchaLoaderService, RecaptchaComponent } from '@ng-ben/google-recaptcha';

@Component({
  selector: 'app-google-recaptcha-demo',
  imports: [FormsModule, RecaptchaComponent],
  providers: [RecaptchaLoaderService],
  template: `
    <!--  Basic -->
    <google-recaptcha
      [siteKey]="siteKey"
      (errored)="onError($event)"
      (resolved)="resolved($event)"
      errorMode="handled"
    ></google-recaptcha>
    <!--form-->
    <form #captchaProtectedForm="ngForm">
      <google-recaptcha
        [siteKey]="siteKey"
        [(ngModel)]="formModel.captcha"
        name="captcha"
        required
        #captchaControl="ngModel"
      ></google-recaptcha>
      <div [hidden]="captchaControl.valid || captchaControl.pristine" class="error">Captcha must be solved</div>
      <div [hidden]="!captchaControl.valid" class="success">Captcha is valid</div>
      <div [hidden]="captchaProtectedForm.form.valid" class="error">The form must be filled out</div>
      <div [hidden]="!captchaProtectedForm.form.valid" class="success">The form is valid</div>
      <button (click)="formModel.captcha = ''">Reset Captcha</button>
    </form>
    <!--    invisible -->
    <google-recaptcha
      #captchaRef="googleRecaptcha"
      [siteKey]="siteKey"
      (resolved)="resolved($event)"
      (errored)="onError($event)"
      errorMode="handled"
      size="invisible"
    ></google-recaptcha>
    <button (click)="captchaRef.execute()">Submit</button>
    <button (click)="captchaRef.reset()">Reset</button>
    <pre> reCAPTCHA response log:{{ captchaResponse || '(empty)' }}</pre>
  `,
})
export class GoogleRecaptchaDemoComponent {
  siteKey = '';
  public formModel: { captcha?: string } = {};
  public captchaResponse = '';

  public resolved(captchaResponse: string | null): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    const newResponse = captchaResponse
      ? `${captchaResponse.substring(0, 7)}...${captchaResponse.substring(captchaResponse.length - 7)}`
      : captchaResponse;
    this.captchaResponse += `${JSON.stringify(newResponse)}\n`;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    this.captchaResponse += `ERROR; error details (if any) have been logged to console\n`;
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
