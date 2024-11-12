import { createFeature, createReducer, on } from '@ngrx/store';
import { TradeActions } from './trades.actions';
import { Trade } from '../trades.model';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export const tradesFeatureKey = 'trades';

export interface TradeState extends EntityState<Trade> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Trade> = createEntityAdapter<Trade>({
  selectId: (trade: Trade) => trade._id || '',
});

export const initialState: TradeState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(TradeActions.loadTrades, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TradeActions.loadTradesSuccess, (state, { trades }) => {
    console.log('Trades loaded successfully:', trades); // Debug log for data structure
    return adapter.setAll(trades, { ...state, loading: false });
  }),
  on(TradeActions.loadTradesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

export const tradesFeature = createFeature({
  name: tradesFeatureKey,
  reducer,
});

