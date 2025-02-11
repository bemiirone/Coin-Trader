// user.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../user.service';
import { UserActions, } from './user.actions';
import { catchError, filter, map, mergeMap, Observable, of, tap } from 'rxjs';
import { User, UserAdd } from '../user.model';
import { Store } from '@ngrx/store';
import { selectAuthUser } from './auth/auth.selectors';

@Injectable()
export class UserEffects {
  loadUsers$: Observable<ReturnType<typeof UserActions.loadUsersSuccess | typeof UserActions.loadUsersFailure>>;
  addUser$: Observable<ReturnType<typeof UserActions.addUserSuccess | typeof UserActions.addUserFailure>>;
  updatePortfolioTotal$: Observable<{ type: string, user: User } | { type: string, error: string }>;
  setSelectedUseId$: Observable<void>;
  constructor(private actions$: Actions, private userService: UserService, private store: Store) {
    // Load users effect
    this.loadUsers$ = createEffect(() =>
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
    
    // Set selected user id effect
    this.setSelectedUseId$ = createEffect(
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
    
    // Add user effect
    this.addUser$ = createEffect(() =>
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
    
    // Update user portfolio total and cash effect
    this.updatePortfolioTotal$ = createEffect(() =>
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
}
