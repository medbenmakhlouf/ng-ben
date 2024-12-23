import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type RecaptchaErrorParameters, RecaptchaLoaderService, RecaptchaComponent } from '@ng-ben/google-recaptcha';

@Component({
  selector: 'app-google-recaptcha-demo',
  imports: [FormsModule, RecaptchaComponent],
  providers: [RecaptchaLoaderService],
  templateUrl: './google-recaptcha-demo.component.html',
})
export class GoogleRecaptchaDemoComponent {
  siteKey = '6LfVnycaAAAAAGYhQHAvqV0TbOBOOKi0sERLHmaV';
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
