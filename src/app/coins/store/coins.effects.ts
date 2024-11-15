// coins.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CoinsActions } from './coins.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CoinResponse } from '../coins.model';
import { CoinsService } from '../../services/coin-market.service';

@Injectable()
export class CoinsEffects {
  loadCoins$: Observable<
  ReturnType<typeof CoinsActions.loadCoinsSuccess | typeof CoinsActions.loadCoinsFailure>
>;
  constructor(
    private actions$: Actions,
    private coinsService: CoinsService
  ) {
    // Load coins effect
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
