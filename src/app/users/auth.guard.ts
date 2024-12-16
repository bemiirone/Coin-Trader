import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { selectAuthToken } from './store/auth/auth.selectors';
import { AuthState } from './store/auth/auth.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private store: Store<AuthState>, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.store.select(selectAuthToken).pipe(
            map((token) => {
                if (token) return true;
                this.router.navigate(['/']);
                return false;
            })
        );
    }
}

