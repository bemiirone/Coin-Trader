import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth/auth.actions';
import { selectForgotPasswordSuccess, selectAuthError } from '../store/auth/auth.selectors';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  success$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.success$ = this.store.select(selectForgotPasswordSuccess);
    this.error$ = this.store.select(selectAuthError);
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.store.dispatch(AuthActions.forgotPassword({ email: this.forgotPasswordForm.value.email }));
      this.forgotPasswordForm.reset();
    }
  }
}
