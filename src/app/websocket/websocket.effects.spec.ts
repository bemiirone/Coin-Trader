import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, timer, empty } from 'rxjs';
import { WebSocketEffects } from './websocket.effects';
import { WebSocketActions } from './websocket.actions';
import { WebSocketService, PriceUpdate } from '../services/websocket.service';
import { AuthActions } from '../users/store/auth/auth.actions';
import { cold, hot } from 'jasmine-marbles';
import { Store } from '@ngrx/store';

describe('WebSocketEffects', () => {
  let actions$: Observable<any>;
  let effects: WebSocketEffects;
  let wsService: jasmine.SpyObj<WebSocketService>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    const wsServiceSpy = jasmine.createSpyObj('WebSocketService', [
      'connect', 
      'disconnect',
      'getPriceUpdates$',
      'getTradeUpdates$',
      'getPortfolioUpdates$',
      'getConnectionStatus$'
    ]);
    wsServiceSpy.getPriceUpdates$.and.returnValue(of([]));
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      providers: [
        WebSocketEffects,
        provideMockActions(() => actions$),
        { provide: WebSocketService, useValue: wsServiceSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });

    effects = TestBed.inject(WebSocketEffects);
    wsService = TestBed.inject(WebSocketService) as jasmine.SpyObj<WebSocketService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  describe('connectWebSocket$', () => {
    it('should dispatch connectWebSocketSuccess on successful connection', () => {
      const connectAction = WebSocketActions.connectWebSocket();
      const successAction = WebSocketActions.connectWebSocketSuccess();

      actions$ = hot('-a-', { a: connectAction });
      const response = cold('-a|', { a: true });
      wsService.connect.and.returnValue(response);

      const expected = cold('--b', { b: successAction });

      expect(effects.connectWebSocket$).toBeObservable(expected);
    });

    it('should dispatch connectWebSocketFailure on connection error', () => {
      const connectAction = WebSocketActions.connectWebSocket();
      const error = new Error('Connection failed');
      const failureAction = WebSocketActions.connectWebSocketFailure({ error: 'Connection failed' });

      actions$ = hot('-a-', { a: connectAction });
      const response = cold('-#|', {}, error);
      wsService.connect.and.returnValue(response);

      const expected = cold('--b', { b: failureAction });

      expect(effects.connectWebSocket$).toBeObservable(expected);
    });
  });

  describe('reconnect$', () => {
    it('should dispatch connectWebSocketSuccess on successful reconnection', () => {
      const reconnectAction = WebSocketActions.reconnect();
      const successAction = WebSocketActions.connectWebSocketSuccess();

      actions$ = hot('-a-', { a: reconnectAction });
      const response = cold('-a|', { a: true });
      wsService.connect.and.returnValue(response);

      const expected = cold('--b', { b: successAction });

      expect(effects.reconnect$).toBeObservable(expected);
    });

    it('should dispatch connectWebSocketFailure on reconnection error', () => {
      const reconnectAction = WebSocketActions.reconnect();
      const error = new Error('Reconnection failed');
      const failureAction = WebSocketActions.connectWebSocketFailure({ error: 'Reconnection failed' });

      actions$ = hot('-a-', { a: reconnectAction });
      const response = cold('-#|', {}, error);
      wsService.connect.and.returnValue(response);

      const expected = cold('--b', { b: failureAction });

      expect(effects.reconnect$).toBeObservable(expected);
    });
  });

  describe('autoReconnect$', () => {
    it('should be defined', () => {
      expect(effects.autoReconnect$).toBeDefined();
    });
  });

  describe('disconnectOnLogout$', () => {
    it('should call wsService.disconnect and dispatch disconnectSuccess on logout', () => {
      const logoutAction = AuthActions.logoutSuccess();
      const disconnectSuccessAction = WebSocketActions.disconnectSuccess();

      actions$ = hot('-a-', { a: logoutAction });

      const expected = cold('-b', { b: disconnectSuccessAction });

      expect(effects.disconnectOnLogout$).toBeObservable(expected);
      expect(wsService.disconnect).toHaveBeenCalled();
    });
  });

  describe('priceUpdate$', () => {
    it('should dispatch priceUpdate action when receiving price updates', () => {
      const priceUpdates: PriceUpdate[] = [
        { coin_id: 1, symbol: 'BTC', name: 'Bitcoin', price: 50000, change24h: 2.5, marketCap: 1000000000, volume24h: 25000000000 },
      ];

      wsService.getPriceUpdates$.and.returnValue(of(priceUpdates));

      effects.priceUpdate$.subscribe((action) => {
        expect(action.type).toContain('Price Update');
      });
    });
  });
});
