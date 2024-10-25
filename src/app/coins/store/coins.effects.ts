// coins.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CoinsActions } from './coins.actions';
import { CoinsService } from '../coins.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CoinResponse } from '../coins.model';

@Injectable()
export class CoinsEffects {
  constructor(
    private actions$: Actions,
    private coinsService: CoinsService
  ) {}

  loadCoins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsActions.loadCoins), // Triggers when 'Load Coins' is dispatched
      mergeMap(() =>
        this.coinsService.getCoins().pipe(
          map((response: CoinResponse) => CoinsActions.loadCoinsSuccess({ coinsSuccess: response })),
          catchError((error) => of(CoinsActions.loadCoinsFailure({ coinsFailure: error })))
        )
      )
    )
  );
}
