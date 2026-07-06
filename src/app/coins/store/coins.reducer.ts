import { createFeature, createReducer, on } from '@ngrx/store';
import { CoinsActions } from './coins.actions';
import { CoinResponse } from '../coins.model';

export const coinsFeatureKey = 'coins';

export interface CoinState {
  loading: boolean;
  error: string | null;
  data: CoinResponse | null;
}

export const initialState: CoinState = {
  loading: false,
  error: null,
  data: null,
};

export const reducer = createReducer(
  initialState,
  on(CoinsActions.loadCoins, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CoinsActions.loadCoinsSuccess, (state, { coinsSuccess }) => {
    return {
      ...state,
      data: coinsSuccess,
      loading: false,
    };
  }),
  on(CoinsActions.loadCoinsFailure, (state, { error }) => ({
    ...state,
    error: error,
    loading: false,
  })),
  on(CoinsActions.priceUpdate, (state, { prices }) => {
    if (!state.data) return state;

    const updatedData = {
      ...state.data,
      data: state.data.data.map((coin) => {
        const priceUpdate = prices.find((p) => p.coin_id === coin.id);
        if (!priceUpdate) return coin;

        return {
          ...coin,
          quote: {
            ...coin.quote,
            USD: {
              ...coin.quote.USD,
              price: priceUpdate.price,
              percent_change_24h: priceUpdate.change24h,
              market_cap: priceUpdate.marketCap,
              volume_24h: priceUpdate.volume24h,
            },
          },
        };
      }),
    };

    return {
      ...state,
      data: updatedData,
    };
  })
);

export const coinsFeature = createFeature({
  name: coinsFeatureKey,
  reducer,
});
