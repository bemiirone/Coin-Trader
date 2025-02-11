import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserActions } from '../store/user.actions';
import { selectIsRegistering, selectRegistrationError } from '../store/user.selectors';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    AsyncPipe
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isRegistering$: Observable<boolean>;
  registrationError$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      deposit: ['', [Validators.required, Validators.min(0)]]
    });

    this.isRegistering$ = this.store.select(selectIsRegistering);
    this.registrationError$ = this.store.select(selectRegistrationError);
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
