import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { authCommonImports } from '../auth.common-imports';
import { ToastService } from '../../core/services/toast/toast.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [authCommonImports],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  loginForm !: FormGroup;
    ngOnInit(): void {
       this.loginForm = this.formBuilder.group({
            email: new FormControl('', [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl('', Validators.required),
        });
    }

    onSubmit(){
      if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            this.authService.login(email, password).subscribe({
                next: () => {

                  this.router.navigate(['/'])},
                error: (err: HttpErrorResponse) => {
                      console.log('LOGIN error - navigating...');

                    if (err.status === 401) {
                        this.toastService.error(
                            'Login Failed',
                            'Invalid email or password',
                        );
                    } else {
                        this.toastService.error(
                            'Login Failed',
                            'An unexpected error occurred. Please try again later',
                        );
                    }
                }, 
            });
        }
        else{
          console.log("login form invalid!")
        }
    }
  
}