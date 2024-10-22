import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CoinsActions } from './coins.actions';
import { CoinData } from '../coins.model';

export const coinsFeatureKey = 'coins';

export interface State extends EntityState<CoinData> {
  // additional entities state properties
}

export const adapter: EntityAdapter<CoinData> = createEntityAdapter<CoinData>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(CoinsActions.addCoins, (state, action) =>
    adapter.addOne(action.coins, state)
  ),
  on(CoinsActions.upsertCoins, (state, action) =>
    adapter.upsertOne(action.coins, state)
  ),
  on(CoinsActions.addCoinsSuccess, (state, action) =>
    adapter.addMany(action.coinsSuccess, state)
  ),
  on(CoinsActions.upsertCoinsSuccess, (state, action) =>
    adapter.upsertMany(action.coinsSuccess, state)
  ),
  on(CoinsActions.updateCoins, (state, action) =>
    adapter.updateOne(action.coins, state)
  ),
  on(CoinsActions.updateCoinsSuccess, (state, action) =>
    adapter.updateMany(action.coinsSuccess, state)
  ),
  on(CoinsActions.deleteCoins, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(CoinsActions.deleteCoinsSuccess, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(CoinsActions.loadCoinsSuccess, (state, action) =>
    adapter.setAll(action.coinsSuccess, state)
  ),
  on(CoinsActions.clearCoinsSuccess, (state) => adapter.removeAll(state))
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
