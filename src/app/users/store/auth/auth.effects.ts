import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, Observable, of, tap } from 'rxjs';
import { UserService } from '../../user.service';
import { Store } from '@ngrx/store';
import { CoinsActions } from '../../../coins/store/coins.actions';

@Injectable()
export class AuthEffects {
  login$: Observable<ReturnType<typeof AuthActions.loginSuccess | typeof AuthActions.loginFailure>>;
  logout$: Observable<ReturnType<typeof AuthActions.logoutSuccess>>;
  initializeAuth$: Observable<ReturnType<typeof AuthActions.loginSuccess | typeof AuthActions.noop>>;
  constructor(private actions$: Actions, private userService: UserService, private store: Store) {

    this.login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.userService.login(email, password).pipe(
          map(({ user, token }) => AuthActions.loginSuccess({ user, token })),
          tap(({ user, token }) => {
            // Save to localStorage
            localStorage.setItem('authUser', JSON.stringify(user));
            localStorage.setItem('authToken', token);
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('authUser');
          localStorage.removeItem('authToken');
        }),
        map(() => AuthActions.logoutSuccess())
      )
    );

    this.initializeAuth$ = createEffect(
      () => {
        return this.actions$.pipe(
          ofType(CoinsActions.loadCoinsSuccess),
          map(() => {
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
              const token = localStorage.getItem('authToken');
              const user = localStorage.getItem('authUser');
    
              if (token && user) {
                return AuthActions.loginSuccess({ user: JSON.parse(user), token });
              }
            }
            return AuthActions.noop();
          }),
          catchError((error) => {
            console.error('Error initializing auth state:', error);
            return of(AuthActions.noop());
          })
        );
      },
      { dispatch: true }
    );
  }
}
