import { reducer, initialState, WebSocketState } from './websocket.reducer';
import { WebSocketActions } from './websocket.actions';

describe('WebSocket Reducer', () => {
  describe('initial state', () => {
    it('should have the correct initial state', () => {
      expect(initialState).toEqual({
        connected: false,
        error: null,
        retryCount: 0,
        lastDisconnectTime: null,
      });
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = { type: 'UNKNOWN' } as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('connectWebSocket', () => {
    it('should clear the error state', () => {
      const stateWithErrors: WebSocketState = {
        ...initialState,
        error: 'Previous error',
        retryCount: 3,
      };

      const result = reducer(stateWithErrors, WebSocketActions.connectWebSocket());

      expect(result.error).toBeNull();
      expect(result.connected).toBe(false);
    });
  });

  describe('connectWebSocketSuccess', () => {
    it('should set connected to true and clear error and retry count', () => {
      const stateWithErrors: WebSocketState = {
        ...initialState,
        error: 'Connection failed',
        retryCount: 5,
      };

      const result = reducer(stateWithErrors, WebSocketActions.connectWebSocketSuccess());

      expect(result.connected).toBe(true);
      expect(result.error).toBeNull();
      expect(result.retryCount).toBe(0);
    });

    it('should set connected from disconnected state', () => {
      const result = reducer(initialState, WebSocketActions.connectWebSocketSuccess());
      expect(result.connected).toBe(true);
    });
  });

  describe('connectWebSocketFailure', () => {
    it('should set connected to false, set error, and increment retry count', () => {
      const result = reducer(initialState, WebSocketActions.connectWebSocketFailure({ error: 'Connection refused' }));

      expect(result.connected).toBe(false);
      expect(result.error).toBe('Connection refused');
      expect(result.retryCount).toBe(1);
    });

    it('should increment retry count from existing value', () => {
      const stateWithRetries: WebSocketState = {
        ...initialState,
        retryCount: 3,
        error: 'Previous error',
      };

      const result = reducer(stateWithRetries, WebSocketActions.connectWebSocketFailure({ error: 'Timeout' }));

      expect(result.retryCount).toBe(4);
      expect(result.error).toBe('Timeout');
    });

    it('should set connected to false even if previously connected', () => {
      const connectedState: WebSocketState = {
        ...initialState,
        connected: true,
        retryCount: 0,
      };

      const result = reducer(connectedState, WebSocketActions.connectWebSocketFailure({ error: 'Disconnected' }));

      expect(result.connected).toBe(false);
      expect(result.error).toBe('Disconnected');
      expect(result.retryCount).toBe(1);
    });
  });

  describe('reconnect', () => {
    it('should clear the error state', () => {
      const stateWithErrors: WebSocketState = {
        ...initialState,
        error: 'Previous error',
        retryCount: 2,
      };

      const result = reducer(stateWithErrors, WebSocketActions.reconnect());

      expect(result.error).toBeNull();
      expect(result.retryCount).toBe(2);
      expect(result.connected).toBe(false);
    });

    it('should not change retry count', () => {
      const result = reducer(initialState, WebSocketActions.reconnect());
      expect(result.retryCount).toBe(0);
    });
  });

  describe('disconnect', () => {
    it('should set connected to false', () => {
      const connectedState: WebSocketState = {
        ...initialState,
        connected: true,
        error: null,
        retryCount: 0,
      };

      const result = reducer(connectedState, WebSocketActions.disconnect());

      expect(result.connected).toBe(false);
      expect(result.error).toBeNull();
      expect(result.retryCount).toBe(0);
    });

    it('should not clear error or retry count', () => {
      const stateWithErrors: WebSocketState = {
        ...initialState,
        connected: true,
        error: 'Some error',
        retryCount: 3,
      };

      const result = reducer(stateWithErrors, WebSocketActions.disconnect());

      expect(result.connected).toBe(false);
      expect(result.error).toBe('Some error');
      expect(result.retryCount).toBe(3);
    });
  });

  describe('disconnectSuccess', () => {
    it('should set connected to false and clear all error state', () => {
      const connectedState: WebSocketState = {
        ...initialState,
        connected: true,
        error: 'Error',
        retryCount: 5,
      };

      const result = reducer(connectedState, WebSocketActions.disconnectSuccess());

      expect(result.connected).toBe(false);
      expect(result.error).toBeNull();
      expect(result.retryCount).toBe(0);
      expect(result.lastDisconnectTime).not.toBeNull();
    });

    it('should set lastDisconnectTime to current timestamp', () => {
      const before = Date.now();
      const result = reducer(initialState, WebSocketActions.disconnectSuccess());
      const after = Date.now();

      expect(result.lastDisconnectTime).toBeGreaterThanOrEqual(before);
      expect(result.lastDisconnectTime).toBeLessThanOrEqual(after);
    });

    it('should reset retry count to zero', () => {
      const stateWithRetries: WebSocketState = {
        ...initialState,
        retryCount: 10,
      };

      const result = reducer(stateWithRetries, WebSocketActions.disconnectSuccess());

      expect(result.retryCount).toBe(0);
    });
  });
});
