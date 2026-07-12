import { Component, inject, OnInit } from '@angular/core';
import { authCommonImports } from '../auth.common-imports';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../core/services/toast/toast.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up.component',
  imports: [authCommonImports],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export default class SignUpComponent implements OnInit {

    private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  signUpForm!: FormGroup;

  ngOnInit(): void {
     this.signUpForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
  
    });
  }

  isInvalid(controlName: string): boolean {
  const control = this.signUpForm.get(controlName);
  return !!(control && control.invalid && control.touched);
  }
  

  onSubmit(){
    if(this.signUpForm.valid){
      const registerRequest = this.signUpForm.value;

      this.authService.register(registerRequest).subscribe({
        next: () => {
          this.toastService.success('Registration successful');
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) =>{
          if (err.status === 400) {
            this.toastService.error('Sign Up Failed', 'Form content has issues');
          } else if (err.status === 409) {
            this.toastService.error('User already exists', 'A user with this username/email or phone number already exists');
          } else {
            this.toastService.error('Sign Up Failed', 'An unexpected error occurred. Please try again later');
          }
        }
      });
    }else {
      this.signUpForm.markAllAsTouched(); // Show validation errors if form is invalid
    }

  }
}
