// user.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../user.service';
import { UserActions, } from './user.actions';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import { User } from '../user.model';
import { Store } from '@ngrx/store';
import { selectAuthUser } from './auth/auth.selectors';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject(Store);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getUsers().pipe(
          map((users: User[]) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );
  
  setSelectedUseId$ = createEffect(
    () =>
      this.store.select(selectAuthUser).pipe(
        filter((user): user is User => !!user),
        tap((user) => {
          this.store.dispatch(UserActions.setSelectedUserId({ id: user._id }));
        }),
        map(() => void 0), 
        catchError((error) => {
          console.error('Error selecting user ID:', error);
          return of(void 0);
        })
      ),
    { dispatch: false }
  );
  
  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      mergeMap((action) =>
        this.userService.addUser(action.user).pipe(
          map((response: User) => UserActions.addUserSuccess({ user: response })),
          catchError((error) => of(UserActions.addUserFailure({ error })))
        )
      )
    )
  );
  
  updatePortfolioTotal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserPortfolio),
      mergeMap(({ userId, portfolioTotal, cash }) =>
        this.userService.updateUserPortfolioAndCash(userId, portfolioTotal, cash).pipe(
          map((updatedUser) => UserActions.updateUserPortfolioSuccess({ user: updatedUser })),
          catchError((error) => of(UserActions.updateUserPortfolioFailure({ error })))
        )
      )
    )
  );
}
