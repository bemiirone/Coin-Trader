import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { UserService } from '../../user.service';
import { Store } from '@ngrx/store';
import { CoinsActions } from '../../../coins/store/coins.actions';
import { UserActions } from '../user.actions';
import { TradeActions } from '../../../trades/store/trades.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.userService.login(email, password).pipe(
          map(({ user, token }) => AuthActions.loginSuccess({ user, token })),
          tap(({ user, token }) => {
            localStorage.setItem('authUser', JSON.stringify(user));
            localStorage.setItem('authToken', token);
          }),
          catchError((error) => {
            const errorMessage = error?.error?.message || error?.message || 'Login failed';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  loadDataOnLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => UserActions.loadUsers())
    )
  );

  loadTradesOnLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => TradeActions.loadTrades())
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  initializeAuth$ = createEffect(
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

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      mergeMap(({ email }) =>
        this.userService.forgotPassword(email).pipe(
          map(() => AuthActions.forgotPasswordSuccess()),
          catchError((error) => {
            const errorMessage = error?.error?.message || error?.message || 'Failed to request password reset';
            return of(AuthActions.forgotPasswordFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      mergeMap(({ token, password }) =>
        this.userService.resetPassword(token, password).pipe(
          map(() => AuthActions.resetPasswordSuccess()),
          catchError((error) => {
            const errorMessage = error?.error?.message || error?.message || 'Failed to reset password';
            return of(AuthActions.resetPasswordFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
}
