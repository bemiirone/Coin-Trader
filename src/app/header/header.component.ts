import { Component, Input } from '@angular/core';
import { User } from '../users/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectSelectedUser } from '../users/store/user.selectors';
import { selectAuthUser } from '../users/store/auth/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user$: Observable<User | null>;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {
    this.user$ = this.store.select(selectAuthUser);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
