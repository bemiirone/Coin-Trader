import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { TradeActions } from './trades.actions';
import { Trade } from '../trades.model';
import { TradesService } from '../trades.service';



@Injectable()
export class TradesEffects {
  loadTrades$: Observable<ReturnType<typeof TradeActions.loadTradesSuccess | typeof TradeActions.loadTradesFailure>>;

  constructor(private actions$: Actions, private tradesService: TradesService) {
    this.loadTrades$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TradeActions.loadTrades),
        mergeMap(() =>
          this.tradesService.getTrades().pipe(
            map((trades: Trade[]) => TradeActions.loadTradesSuccess({ trades })),
            catchError((error) => of(TradeActions.loadTradesFailure({ error })))
          )
        )
      )
    );``
  }
}
