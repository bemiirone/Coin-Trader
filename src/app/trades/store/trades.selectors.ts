import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCoinTrades } from '../../coins/store/coins.selectors';
import { selectSelectedUser } from '../../users/store/user.selectors';
import { TradeState } from './trades.reducer';


export const selectUserPortfolio = createSelector(
  selectSelectedUser,
  selectCoinTrades,
  (user, coins) => {
    if (!user || !user.coin_ids) return [];
    return user.coin_ids
      .map((coinId) => coins.find((coin) => coin.id === coinId))
      .filter((coin) => coin);
  }
);
export const selectTradesState = createFeatureSelector<TradeState>('trades');

export const selectTradeSuccess = createSelector(
  selectTradesState,
  (tradesState) => tradesState.success
);

export const selectTradeError = createSelector(
  selectTradesState,
  (tradesState) => tradesState.error
);
