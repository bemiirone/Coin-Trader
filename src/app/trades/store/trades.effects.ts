import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  mergeMap,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { TradeActions } from './trades.actions';
import { Trade } from '../trades.model';
import { TradesService } from '../trades.service';
import { Store } from '@ngrx/store';
import { UserActions } from '../../users/store/user.actions';
import { selectSelectedUser } from '../../users/store/user.selectors';
import { selectUserBuyTradesValue, selectUserCash } from './trades.selectors';
import { UserService } from '../../users/user.service';

@Injectable()
export class TradesEffects {
  private actions$ = inject(Actions);
  private tradesService = inject(TradesService);
  private store = inject(Store);
  private userService = inject(UserService);

  loadTrades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeActions.loadTrades),
      mergeMap(() =>
        this.tradesService.getTrades().pipe(
          map((trades: Trade[]) =>
            TradeActions.loadTradesSuccess({ trades })
          ),
          catchError((error) => of(TradeActions.loadTradesFailure({ error })))
        )
      )
    )
  );

  addTrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeActions.addTrade),
      mergeMap(({ trade }) =>
        this.tradesService.addTrade(trade).pipe(
          map((addedTrade: Trade) =>
            TradeActions.addTradeSuccess({ trade: addedTrade })
          ),
          catchError((error) => of(TradeActions.addTradeFailure({ error: error.message })))
        )
      )
    )
  );

  addTradesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeActions.addTradeSuccess),
      withLatestFrom(
        this.store.select(selectSelectedUser),
        this.store.select(selectUserBuyTradesValue),
        this.store.select(selectUserCash)
      ),
      mergeMap(([{ trade }, user, portfolioValue, cash]) => {
        if (!user) {
          return of(
            UserActions.updateUserPortfolioFailure({
              error: 'No user selected',
            })
          );
        }

        const updatedCash =
          trade.order === 'buy'
            ? cash - trade.amount 
            : cash + trade.amount; 

        const tradeValue = trade.volume * trade.price;
        const updatedPortfolioTotal =
          trade.order === 'buy'
            ? portfolioValue + tradeValue 
            : portfolioValue - tradeValue; 

        return this.userService
          .updateUserPortfolioAndCash(
            user._id,
            updatedPortfolioTotal,
            updatedCash
          )
          .pipe(
            map(() =>
              UserActions.updateUserPortfolio({
                userId: user._id,
                portfolioTotal: updatedPortfolioTotal,
                cash: updatedCash,
              })
            ),
            tap(() => {
              this.store.dispatch(TradeActions.loadTrades());
            }),
            catchError((error) =>
              of(
                UserActions.updateUserPortfolioFailure({
                  error: error.message,
                })
              )
            )
          );
      })
    )
  );
}
