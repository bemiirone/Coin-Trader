import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth/auth.actions';
import { selectResetPasswordSuccess, selectAuthError } from '../store/auth/auth.selectors';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  hidePassword = true;
  success$: Observable<boolean>;
  error$: Observable<string | null>;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.success$ = this.store.select(selectResetPasswordSuccess);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      this.store.dispatch(AuthActions.resetPassword({
        token: this.token,
        password: this.resetPasswordForm.value.password
      }));

      this.success$.subscribe((success) => {
        if (success) {
          setTimeout(() => {
            this.router.navigate(['/auth/register']);
          }, 3000);
        }
      });
    }
  }
}
