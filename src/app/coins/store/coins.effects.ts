import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { CoinsActions } from './coins.actions';

@Injectable()
export class CoinsEffects {
  loadCoinsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoinsActions.loadCoinsSuccess),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map((data) => CoinsActions.loadCoinsSuccess({ coinsSuccess: data })),
          catchError((error) => of(CoinsActions.loadCoinsFailure({ coinsFailure: error })))
        )
      )
    );
  });

  constructor(private actions$: Actions) {}
}
