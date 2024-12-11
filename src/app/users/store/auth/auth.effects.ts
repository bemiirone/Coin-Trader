import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, Observable, of, tap } from 'rxjs';
import { UserService } from '../../user.service';

@Injectable()
export class AuthEffects {
  login$: Observable<ReturnType<typeof AuthActions.loginSuccess | typeof AuthActions.loginFailure>>;
  logout$: Observable<ReturnType<typeof AuthActions.logout>>;
  constructor(private actions$: Actions, private userService: UserService) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ email, password }) =>
          this.userService.login(email, password).pipe(
            map(({ user, token }) => AuthActions.loginSuccess({ user, token })),
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
        map(() => AuthActions.logout())
      )
    );
  }
}
