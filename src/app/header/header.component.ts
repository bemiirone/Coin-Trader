import { Component, Input } from '@angular/core';
import { User } from '../users/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store, on } from '@ngrx/store';
import { selectAuthUser } from '../users/store/auth/auth.selectors';
import { AuthActions } from '../users/store/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user$!: Observable<User | null>;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {}
  ngOnInit() {
    this.user$ = this.store.select(selectAuthUser);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email, password }));
      this.loginForm.reset();
    }
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
