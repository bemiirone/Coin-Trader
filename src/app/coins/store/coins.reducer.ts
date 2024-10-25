import { createFeature, createReducer, on } from '@ngrx/store';
import { CoinsActions } from './coins.actions';
import { CoinResponse } from '../coins.model';

export const coinsFeatureKey = 'coins';

export interface State {
  loading: boolean;
  error: string | null;
  data: CoinResponse | null; // Storing the entire response here
}

export const initialState: State = {
  loading: false,
  error: null,
  data: null,
};

export const reducer = createReducer(
  initialState,
  on(CoinsActions.loadCoinsSuccess, (state, { coinsSuccess }) => ({
    ...state,
    data: coinsSuccess, // Assign the entire response here
    loading: false,
  })),
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
