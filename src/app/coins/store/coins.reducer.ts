import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CoinsActions } from './coins.actions';
import { CoinData } from '../coins.model';

export const coinsFeatureKey = 'coins';

export interface State extends EntityState<CoinData> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<CoinData> = createEntityAdapter<CoinData>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(CoinsActions.loadCoinsSuccess, (state, { coinsSuccess }) =>
    adapter.setAll(coinsSuccess, { ...state, loading: false })
  ),
  on(CoinsActions.loadCoinsFailure, (state, { coinsFailure }) => ({
    ...state,
    error: coinsFailure.error_message,
    loading: false,
  })),
  on(CoinsActions.addCoinsSuccess, (state, { coinsSuccess }) =>
    adapter.addMany(coinsSuccess, state)
  ),
  on(CoinsActions.updateCoinsSuccess, (state, { coinsSuccess }) =>
    adapter.updateMany(coinsSuccess, state)
  ),
  on(CoinsActions.deleteCoinsSuccess, (state, { ids }) =>
    adapter.removeMany(ids, state)
  )
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
