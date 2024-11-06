import { createFeature, createReducer, on } from '@ngrx/store';
import { CoinsActions } from './coins.actions';
import { CoinResponse } from '../coins.model';

export const coinsFeatureKey = 'coins';

export interface CoinState {
  loading: boolean;
  error: string | null;
  data: CoinResponse | null; // Storing the entire response here
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
    console.log('Coins loaded successfully:', coinsSuccess);  // Debug log for data structure
    return {
      ...state,
      data: coinsSuccess,
      loading: false,
    };
  }),
  on(CoinsActions.loadCoinsFailure, (state, { coinsFailure }) => ({
    ...state,
    error: coinsFailure.error_message,
    loading: false,
  }))
);

export const coinsFeature = createFeature({
  name: coinsFeatureKey,
  reducer,
});
