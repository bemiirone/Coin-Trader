import { createSelector, createFeatureSelector } from '@ngrx/store';
// import { AppState } from '../state/app.state';
import { State as CoinsState } from './coins.reducer';

export const selectCoinsState = createFeatureSelector<CoinsState>('coins');

export const selectCoinsResponse = createSelector(
  selectCoinsState,
  (state: CoinsState) => state.data
);