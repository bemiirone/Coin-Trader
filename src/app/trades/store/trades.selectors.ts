import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCoinTrades } from '../../coins/store/coins.selectors';
import { selectSelectedUser } from '../../users/store/user.selectors';
import { TradeState } from './trades.reducer';
import { Trade } from '../trades.model';



export const selectTradesState = createFeatureSelector<TradeState>('trades');

export const selectTrades = createSelector(
  selectTradesState,
  (tradesState) => tradesState.entities
);

// select selected trades filtered by user id
export const selectUserTrades = createSelector(
  selectTrades,
  selectSelectedUser,
  (trades, user) => {
    if (!user) return [];
    return Object.values(trades)
      .filter((trade): trade is Trade => trade !== undefined && trade.user_id === user._id)
      .map(({ user_id, ...rest }) => rest);
  }
);

export const selectTradeSuccess = createSelector(
  selectTradesState,
  (tradesState) => tradesState.success
);

export const selectTradeError = createSelector(
  selectTradesState,
  (tradesState) => tradesState.error
);
