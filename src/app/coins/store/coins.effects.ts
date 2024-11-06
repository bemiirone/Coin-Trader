// coins.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CoinsActions } from './coins.actions';
import { CoinsService } from '../coins.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CoinResponse } from '../coins.model';

@Injectable()
export class CoinsEffects {
  loadCoins$: Observable<
  ReturnType<typeof CoinsActions.loadCoinsSuccess | typeof CoinsActions.loadCoinsFailure>
>;
  constructor(
    private actions$: Actions,
    private coinsService: CoinsService
  ) {
    this.loadCoins$ = createEffect(() => this.actions$.pipe(
      ofType(CoinsActions.loadCoins),
      mergeMap(() => this.coinsService.getCoins()
        .pipe(
          map((coinsSuccess: CoinResponse) => CoinsActions.loadCoinsSuccess({ coinsSuccess })),
          catchError((coinsFailure) => of(CoinsActions.loadCoinsFailure({ coinsFailure: coinsFailure.error || 'Failed to load coins'})))
        )
      )
    ));
  }
}
