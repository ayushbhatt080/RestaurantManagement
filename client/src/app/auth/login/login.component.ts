import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthService } from '../../shared/services/auth.service';
import { LoginRequest } from '../../model/loginrequest';

declare const grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // ─────────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────────
  loginForm!: FormGroup;

  // ─────────────────────────────────────────────
  // UI STATE
  // ─────────────────────────────────────────────
  error = '';
  loading = false;
  showPassword = false;

  // ─────────────────────────────────────────────
  // CAPTCHA
  // ─────────────────────────────────────────────
  captchaToken: string | null = null;
  captchaWidgetId: number | null = null;
  private captchaRenderInterval?: ReturnType<typeof setInterval>;

  /*
    YOUR CAPTCHA SITE KEY
  */
  readonly recaptchaSiteKey =
    '6LdrH-wsAAAAANv-nV_t9teWYCeIDCmOkDr3OVum';

  // ─────────────────────────────────────────────
  // SUBSCRIPTIONS
  // ─────────────────────────────────────────────
  private formSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────
  ngOnInit(): void {

    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });

    // Render captcha
    this.renderCaptcha();

    // Clear error while typing
    this.formSub = this.loginForm.valueChanges.subscribe(() => {
      if (this.error) {
        this.error = '';
      }
    });
  }

  // ─────────────────────────────────────────────
  // DESTROY
  // ─────────────────────────────────────────────
  ngOnDestroy(): void {

    this.formSub?.unsubscribe();

    if (this.captchaRenderInterval) {
      clearInterval(this.captchaRenderInterval);
    }
  }

  // ─────────────────────────────────────────────
  // CAPTCHA RENDER
  // ─────────────────────────────────────────────
  private renderCaptcha(): void {

    this.captchaRenderInterval = setInterval(() => {

      const captchaElement =
        document.getElementById('login-recaptcha');

      if (
        captchaElement &&
        typeof grecaptcha !== 'undefined' &&
        this.captchaWidgetId === null
      ) {

        clearInterval(this.captchaRenderInterval);

        this.captchaWidgetId =
          grecaptcha.render('login-recaptcha', {

            sitekey: this.recaptchaSiteKey,

            theme: 'dark',

            callback: (token: string) => {

              this.captchaToken = token;

              if (
                this.error ===
                'Please verify that you are not a robot.'
              ) {
                this.error = '';
              }
            },

            'expired-callback': () => {

              this.captchaToken = null;

              this.error =
                'Captcha expired. Please verify again.';
            },

            'error-callback': () => {

              this.captchaToken = null;

              this.error =
                'Captcha failed to load. Please refresh the page.';
            }
          });
      }

    }, 300);
  }

  // ─────────────────────────────────────────────
  // RESET CAPTCHA
  // ─────────────────────────────────────────────
  private resetCaptcha(): void {

    this.captchaToken = null;

    if (
      typeof grecaptcha !== 'undefined' &&
      this.captchaWidgetId !== null
    ) {
      grecaptcha.reset(this.captchaWidgetId);
    }
  }

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────
  onSubmit(): void {

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    // captcha validation
    if (!this.captchaToken) {

      this.error =
        'Please verify that you are not a robot.';

      return;
    }

    this.loading = true;
    this.error = '';

    const { username, password } =
      this.loginForm.value;

    const payload: LoginRequest = {
      username,
      password,
      captchaToken: this.captchaToken
    };

    this.authService.login(payload).subscribe({

      next: (res) => {

        this.authService.saveLoginData(res);

        this.loading = false;

        this.router.navigate(['/dashboard']);
      },

      error: (err) => {

        this.loading = false;

        this.error =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message ||
              'Invalid username, password, or captcha';

        // reset password field
        this.loginForm.get('password')?.reset();

        // reset captcha
        this.resetCaptcha();
      }
    });
  }

  // ─────────────────────────────────────────────
  // PASSWORD VISIBILITY
  // ─────────────────────────────────────────────
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ─────────────────────────────────────────────
  // OPTIONAL VALIDATOR
  // ─────────────────────────────────────────────
  shouldContain(
    control: AbstractControl
  ): ValidationErrors | null {

    const value = control.value;

    if (!value) {
      return null;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    return regex.test(value)
      ? null
      : { invalidPass: true };
  }

}