import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCoinData } from '../../coins/store/coins.selectors';
import { selectSelectedUser } from '../../users/store/user.selectors';

export const selectUserPortfolio = createSelector(
  selectSelectedUser,
  selectCoinData,
  (user, coins) => {
    if (!user || !user.coin_ids) return [];
    user.coin_ids.map((coinId) => coins?.find((coin) => coin.id === coinId));
  }
);