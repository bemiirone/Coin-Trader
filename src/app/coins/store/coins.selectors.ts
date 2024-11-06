import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CoinState } from './coins.reducer';
import exp from 'constants';
import { CoinData, PickedCryptoData } from '../coins.model';

export const selectCoinsState = createFeatureSelector<CoinState>('coins');

export const selectCoinData = createSelector(
  selectCoinsState,
  (state: CoinState) => state.data?.data || []
);

export function selectTopCoins(limit: number) {
  return createSelector(
    selectCoinData,
    (coins: CoinData[] | undefined): PickedCryptoData[] => {
      if (!coins) return [];
      return coins.slice(0, limit).map((coin) => ({
        name: coin.name,
        price: coin.quote.USD.price,
        percent_change_1h: coin.quote.USD.percent_change_1h,
        percent_change_24h: coin.quote.USD.percent_change_24h,
        percent_change_7d: coin.quote.USD.percent_change_7d,
        market_cap: coin.quote.USD.market_cap,
      }));
    }
  );
}

export const selectCoinLoading = createSelector(
  selectCoinsState,
  (state: CoinState) => state.loading
);
export const selectCoinError = createSelector(
  selectCoinsState,
  (state: CoinState) => state.error
);