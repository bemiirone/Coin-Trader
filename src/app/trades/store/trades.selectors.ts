import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCoinData, selectCoinError } from '../../coins/store/coins.selectors';
import { selectSelectedUser } from '../../users/store/user.selectors';

export const selectUserPortfolio = createSelector(
  selectSelectedUser,
  selectCoinData,
  (user, coins) => {
    if (!user || !user.coin_ids) return [];
    return user.coin_ids
      .map((coinId) => coins.find((coin) => coin.id === coinId))
      .filter((coin) => coin);
  }
);
