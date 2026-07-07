import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { User } from '../users/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser, selectAuthError } from '../users/store/auth/auth.selectors';
import { AuthActions } from '../users/store/auth/auth.actions';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User | null>;
  error$!: Observable<string | null>;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) { }
  ngOnInit() {
    this.user$ = this.store.select(selectAuthUser);
    this.error$ = this.store.select(selectAuthError);
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

  onFormChange() {
    this.store.dispatch(AuthActions.noop());
  }
}
