import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { TradeActions } from './trades.actions';
import { Trade } from '../trades.model';
import { TradesService } from '../trades.service';



@Injectable()
export class TradesEffects {
  loadTrades$: Observable<ReturnType<typeof TradeActions.loadTradesSuccess | typeof TradeActions.loadTradesFailure>>;
  addTrade$!: Observable<ReturnType<typeof TradeActions.addTradeSuccess | typeof TradeActions.addTradeFailure>>;

  constructor(private actions$: Actions, private tradesService: TradesService) {
    // Load trades effect
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
    );
    // Add trade effect
    this.addTrade$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TradeActions.addTrade),
        mergeMap(({ trade }) =>
          this.tradesService.addTrade(trade).pipe(
            map((addedTrade: Trade) => TradeActions.addTradeSuccess({ trade: addedTrade })),
            catchError((error) => of(TradeActions.addTradeFailure({ error })))
          )
        )
      )
    );
  }
  
}
