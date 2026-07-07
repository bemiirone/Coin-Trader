import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CoinsActions } from './coins.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CoinResponse } from '../coins.model';
import { CoinsService } from '../../services/coin-market.service';

@Injectable()
export class CoinsEffects {
  private actions$ = inject(Actions);
  private coinsService = inject(CoinsService);

  loadCoins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinsActions.loadCoins),
      mergeMap(() =>
        this.coinsService.getCoins().pipe(
          map((coinsSuccess: CoinResponse) =>
            CoinsActions.loadCoinsSuccess({ coinsSuccess })
          ),
          catchError((error) =>
            of(
              CoinsActions.loadCoinsFailure({
                error: error.message || 'Failed to load coins',
              })
            )
          )
        )
      )
    )
  );
}
