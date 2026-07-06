import { createFeature, createReducer, on } from '@ngrx/store';
import { WebSocketActions } from './websocket.actions';

export const websocketFeatureKey = 'websocket';

export interface WebSocketState {
  connected: boolean;
  error: string | null;
  retryCount: number;
  lastDisconnectTime: number | null;
}

export const initialState: WebSocketState = {
  connected: false,
  error: null,
  retryCount: 0,
  lastDisconnectTime: null,
};

export const reducer = createReducer(
  initialState,
  on(WebSocketActions.connectWebSocket, (state) => ({
    ...state,
    error: null,
  })),
  on(WebSocketActions.connectWebSocketSuccess, (state) => ({
    ...state,
    connected: true,
    error: null,
    retryCount: 0,
  })),
  on(WebSocketActions.connectWebSocketFailure, (state, { error }) => ({
    ...state,
    connected: false,
    error,
    retryCount: state.retryCount + 1,
  })),
  on(WebSocketActions.reconnect, (state) => ({
    ...state,
    error: null,
  })),
  on(WebSocketActions.disconnect, (state) => ({
    ...state,
    connected: false,
  })),
  on(WebSocketActions.disconnectSuccess, (state) => ({
    ...state,
    connected: false,
    error: null,
    retryCount: 0,
    lastDisconnectTime: Date.now(),
  }))
);

export const websocketFeature = createFeature({
  name: websocketFeatureKey,
  reducer,
});
