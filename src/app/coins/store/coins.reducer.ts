import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CoinsActions } from './coins.actions';
import { CoinData, CoinResponse } from '../coins.model';

export const coinsFeatureKey = 'coins';

export interface State extends EntityState<CoinResponse> {
  loading: boolean;
  error: string | null;
  data: CoinData[];
}

export const adapter: EntityAdapter<CoinResponse> = createEntityAdapter<CoinResponse>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  error: null,
  data: [],
});

export const reducer = createReducer(
  initialState,
  on(CoinsActions.loadCoinsSuccess, (state, { coinsSuccess }) =>
    adapter.addOne(coinsSuccess, { ...state, loading: false })
  ),
  on(CoinsActions.loadCoinsFailure, (state, { coinsFailure }) => ({
    ...state,
    error: coinsFailure.error_message,
    loading: false,
  })),
);

export const coinsFeature = createFeature({
  name: coinsFeatureKey,
  reducer,
  extraSelectors: ({ selectCoinsState }) => ({
    ...adapter.getSelectors(selectCoinsState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } =
  coinsFeature;
