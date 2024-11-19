// user.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../user.service';
import { UserActions, } from './user.actions';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { User } from '../user.model';

@Injectable()
export class UserEffects {
  loadUsers$: Observable<ReturnType<typeof UserActions.loadUsersSuccess | typeof UserActions.loadUsersFailure>>;
  addUser$: Observable<ReturnType<typeof UserActions.addUserSuccess | typeof UserActions.addUserFailure>>;
  updatePortfolioTotal$: Observable<{ type: string, user: User } | { type: string, error: string }>;
  constructor(private actions$: Actions, private userService: UserService) {
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
    // Add user effect
    this.addUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.addUser),
        mergeMap((action) =>
          this.userService.addUser(action.user).pipe(
            map((user: User) => UserActions.addUserSuccess({ user })),
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
