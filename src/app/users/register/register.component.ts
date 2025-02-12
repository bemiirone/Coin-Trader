import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserActions } from '../store/user.actions';
import { selectAddUserSuccess, selectIsRegistering, selectRegistrationError } from '../store/user.selectors';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isRegistering$: Observable<boolean>;
  success$: Observable<boolean>;
  minimumDeposit = 100000;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      deposit: ['', [Validators.required, Validators.min(this.minimumDeposit)]]
    });

    this.isRegistering$ = this.store.select(selectIsRegistering);
    this.success$ = this.store.select(selectAddUserSuccess);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.store.dispatch(UserActions.addUser({
        user: {
          name: this.registerForm.value.name,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
          deposit: Number(this.registerForm.value.deposit),
          admin: false
        }
      }));
      this.registerForm.reset();
    }
  }
}
