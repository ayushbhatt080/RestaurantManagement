

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { LoginRequest } from '../../model/loginrequest';

// import { AuthService } from '../../service/auth/auth.service';
// import { LoginRequest } from '../../model/loginrequest';

declare const grecaptcha: any;

@Component({
  selector: 'app-login',
  // standalone: true,
  // imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // ── Form ──
  loginForm: FormGroup;

  // ── UI State ──
  loading = false;
  showPassword = false;
  error = '';

  // ── Captcha State ──
  captchaToken: string | null = null;
  captchaWidgetId: number | null = null;
  private captchaRenderInterval?: ReturnType<typeof setInterval>;

  /*
    For development/testing only:
    Google reCAPTCHA v2 test site key.
    Replace this with your real reCAPTCHA site key later.
  */
  readonly recaptchaSiteKey = '6LdrH-wsAAAAANv-nV_t9teWYCeIDCmOkDr3OVum';

  // ── Theme ──
  isDarkMode = true;

  // ── Cleanup ──
  private stars: HTMLElement[] = [];
  private formSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],

      /*
        Important:
        For login page, it is usually better to validate only required/minLength.
        Password strength validation should be on register/change-password page.
        If you keep strong validation here, existing users with old passwords may not login.
      */
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ─────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────

  ngOnInit(): void {
    this.applyTheme(this.isDarkMode);
    this.generateStarfield();
    this.renderCaptcha();

    // Clear error as soon as user types
    this.formSub = this.loginForm.valueChanges.subscribe(() => {
      if (this.error) {
        this.error = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();

    if (this.captchaRenderInterval) {
      clearInterval(this.captchaRenderInterval);
    }

    this.stars.forEach(star => star.remove());
    this.stars = [];
  }

  // ─────────────────────────────────────────────
  // CAPTCHA
  // ─────────────────────────────────────────────

  private renderCaptcha(): void {
    this.captchaRenderInterval = setInterval(() => {
      const captchaElement = document.getElementById('login-recaptcha');

      if (
        captchaElement &&
        typeof grecaptcha !== 'undefined' &&
        this.captchaWidgetId === null
      ) {
        clearInterval(this.captchaRenderInterval);

        this.captchaWidgetId = grecaptcha.render('login-recaptcha', {
          sitekey: this.recaptchaSiteKey,
          theme: 'dark',

          callback: (token: string) => {
            this.captchaToken = token;

            if (
              this.error === 'Please verify that you are not a robot.' ||
              this.error === 'Captcha expired. Please verify again.' ||
              this.error === 'Captcha failed to load. Please try again.'
            ) {
              this.error = '';
            }
          },

          'expired-callback': () => {
            this.captchaToken = null;
            this.error = 'Captcha expired. Please verify again.';
          },

          'error-callback': () => {
            this.captchaToken = null;
            this.error = 'Captcha failed to load. Please try again.';
          }
        });
      }
    }, 300);
  }

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
  // FORM SUBMIT
  // ─────────────────────────────────────────────

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    if (!this.captchaToken) {
      this.error = 'Please verify that you are not a robot.';
      return;
    }

    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;

    const loginPayload: LoginRequest = {
      username,
      password,
      captchaToken: this.captchaToken
    };

    this.authService.login(loginPayload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        this.loading = false;

        this.error =
          err?.error?.message ||
          err?.error ||
          'Invalid username, password, or captcha. Please try again.';

        this.loginForm.get('password')?.reset();
        this.resetCaptcha();
      }
    });
  }

  // ─────────────────────────────────────────────
  // OPTIONAL PASSWORD VALIDATOR
  // Not currently used in login form.
  // Use this mainly for register/change-password.
  // ─────────────────────────────────────────────

  shouldContain(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    return regex.test(value) ? null : { invalidPass: true };
  }

  // ─────────────────────────────────────────────
  // FORM FIELD GETTERS
  // ─────────────────────────────────────────────

  get usernameCtrl() {
    return this.loginForm.get('username')!;
  }

  get passwordCtrl() {
    return this.loginForm.get('password')!;
  }

  get usernameError(): string {
    const control = this.usernameCtrl;

    if (control.touched && control.hasError('required')) {
      return 'Username is required';
    }

    if (control.touched && control.hasError('minlength')) {
      return 'Username must be at least 3 characters';
    }

    return '';
  }

  get passwordError(): string {
    const control = this.passwordCtrl;

    if (control.touched && control.hasError('required')) {
      return 'Password is required';
    }

    if (control.touched && control.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }

    if (control.touched && control.hasError('invalidPass')) {
      return 'Password must include uppercase, lowercase, number, and special character.';
    }

    return '';
  }

  // ─────────────────────────────────────────────
  // PASSWORD VISIBILITY
  // ─────────────────────────────────────────────

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ─────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.setAttribute(
      'data-theme',
      dark ? 'dark' : 'light'
    );
  }

  // ─────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────

  onForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  onCreateAccount(): void {
    this.router.navigate(['/register']);
  }

  // ─────────────────────────────────────────────
  // STARFIELD GENERATOR
  // ─────────────────────────────────────────────

  private generateStarfield(): void {
    const container = document.getElementById('starfield');

    if (!container) {
      return;
    }

    for (let i = 0; i < 55; i++) {
      const star = document.createElement('div');

      star.className = 'star';

      const size = (Math.random() * 1.4 + 0.5).toFixed(1);

      star.style.cssText =
        `width:${size}px; height:${size}px;` +
        `top:${(Math.random() * 100).toFixed(1)}%;` +
        `left:${(Math.random() * 100).toFixed(1)}%;` +
        `--dur:${(Math.random() * 4 + 3).toFixed(1)}s;` +
        `--delay:${(Math.random() * 4).toFixed(1)}s;` +
        `--min-op:${(Math.random() * 0.1).toFixed(2)};` +
        `--max-op:${(Math.random() * 0.35 + 0.15).toFixed(2)};`;

      container.appendChild(star);
      this.stars.push(star);
    }
  }
}