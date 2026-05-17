import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  // standalone: true,
  // imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  error = '';
  loading = false;
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.authService.saveLoginData(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || 'Invalid username or password';

        this.loading = false;
      }
    });
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }

}