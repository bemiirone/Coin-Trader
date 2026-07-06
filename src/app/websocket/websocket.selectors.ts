import { createSelector } from '@ngrx/store';
import { websocketFeature } from './websocket.reducer';

export const selectWebSocketState = websocketFeature.selectWebSocketState;

export const selectWebSocketConnected = createSelector(
  selectWebSocketState,
  (state) => state?.connected ?? false
);

export const selectWebSocketError = createSelector(
  selectWebSocketState,
  (state) => state?.error ?? null
);

export const selectWebSocketRetryCount = createSelector(
  selectWebSocketState,
  (state) => state?.retryCount ?? 0
);
