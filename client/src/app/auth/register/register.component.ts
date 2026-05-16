import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

   registerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
 
  console.log('REGISTER CLICKED');
  console.log('FORM VALUE:', this.registerForm.value);
  console.log('FORM VALID:', this.registerForm.valid);

  if (this.registerForm.invalid) {
    console.log('FORM INVALID - REQUEST NOT SENT');
    this.registerForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  console.log('SENDING REGISTER REQUEST');

  this.auth.register(this.registerForm.value).subscribe({
    next: (res) => {
      console.log('REGISTER SUCCESS:', res);
      this.successMessage = 'Registered successfully! Redirecting to login...';
      this.loading = false;
      setTimeout(() => this.router.navigate(['/login']), 1500);
    },
    error: err => {
      console.log('REGISTER ERROR:', err);
      this.errorMessage = err.error?.error || 'Registration failed.';
      this.loading = false;
    }
  });

  }

}


