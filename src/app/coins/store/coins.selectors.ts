import { createFeatureSelector, createSelector } from '@ngrx/store';
import { coinsFeature } from './coins.reducer';  // This is from the CLI-generated reducer

// Use pre-built selectors from coinsFeature

export const selectCoinsLoading = createSelector(
  coinsFeature.selectCoinsState,
  (state) => state.loading
);

export const selectCoinsError = createSelector(
  coinsFeature.selectCoinsState,
  (state) => state.error
);

export const selectAllCoins = coinsFeature.selectAll;

export const selectTop10Coins = createSelector(
  selectAllCoins,
  (coins) => coins.filter(coin => coin.cmc_rank <= 10)
);
