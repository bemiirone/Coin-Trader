import { TestBed } from '@angular/core/testing';
import { WebSocketService, PriceUpdate, TradeNotification, PortfolioUpdate } from './websocket.service';
import { PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let store: jasmine.SpyObj<Store>;
  let mockSocket: any;

  function configureTestingModule(ioReturnValue: any) {
    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Store, useValue: jasmine.createSpyObj('Store', ['select']) },
      ],
    });

    TestBed.overrideProvider(WebSocketService, {
      useFactory: (platformId: object, store: Store) => {
        const svc = new WebSocketService(platformId, store);
        (svc as any).socket = ioReturnValue;
        return svc;
      },
      deps: [PLATFORM_ID, Store],
    });
  }

  beforeEach(() => {
    mockSocket = {
      connected: false,
      on: jasmine.createSpy('on'),
      disconnect: jasmine.createSpy('disconnect'),
    };

    const storeSpy = jasmine.createSpyObj('Store', ['select']);
    storeSpy.select.and.returnValue(of('test-token'));

    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Store, useValue: storeSpy },
      ],
    });

    service = TestBed.inject(WebSocketService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('connect()', () => {
    it('should return error when not in browser (SSR)', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          WebSocketService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: Store, useValue: jasmine.createSpyObj('Store', ['select']) },
        ],
      });

      const ssrService = TestBed.inject(WebSocketService);
      let result: Error | null = null;
      ssrService.connect().subscribe({
        next: () => {},
        error: (err: Error) => { result = err; },
      });

      expect(result).toBeTruthy();
      expect(result!.message).toContain('WebSocket not available in SSR');
    });
  });

  describe('disconnect()', () => {
    it('should emit false connection status on disconnect', () => {
      let status: boolean | undefined;
      service.getConnectionStatus$().subscribe((s) => { status = s; });

      service.disconnect();

      expect(status).toBe(false);
    });
  });

  describe('getPriceUpdates$()', () => {
    it('should emit price updates', () => {
      const priceUpdate: PriceUpdate = {
        coin_id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 42500,
        change24h: 2.5,
        marketCap: 850000000000,
        volume24h: 25000000000,
      };

      let received: PriceUpdate | undefined;
      service.getPriceUpdates$().subscribe((data) => { received = data; });

      const priceSubject = (service as any).priceUpdateSubject;
      priceSubject.next(priceUpdate);

      expect(received).toEqual(priceUpdate);
    });
  });

  describe('getTradeUpdates$()', () => {
    it('should emit trade notifications', () => {
      const tradeUpdate: TradeNotification = {
        _id: '123',
        user_id: 'user1',
        coin_id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.5,
        price: 42500,
        volume: 21250,
        order: 'buy',
        date: '2024-01-01',
      };

      let received: TradeNotification | undefined;
      service.getTradeUpdates$().subscribe((data) => { received = data; });

      const tradeSubject = (service as any).tradeNotificationSubject;
      tradeSubject.next(tradeUpdate);

      expect(received).toEqual(tradeUpdate);
    });
  });

  describe('getPortfolioUpdates$()', () => {
    it('should emit portfolio updates', () => {
      const portfolioUpdate: PortfolioUpdate = {
        userId: 'user1',
        portfolio_total: 10000,
        cash: 5000,
        deposit: 5000,
      };

      let received: PortfolioUpdate | undefined;
      service.getPortfolioUpdates$().subscribe((data) => { received = data; });

      const portfolioSubject = (service as any).portfolioUpdateSubject;
      portfolioSubject.next(portfolioUpdate);

      expect(received).toEqual(portfolioUpdate);
    });
  });

  describe('getConnectionStatus$()', () => {
    it('should emit connection status changes', () => {
      const statuses: boolean[] = [];
      service.getConnectionStatus$().subscribe((status) => { statuses.push(status); });

      const connSubject = (service as any).connectionSubject;
      connSubject.next(true);
      connSubject.next(false);

      expect(statuses).toContain(true);
      expect(statuses).toContain(false);
    });
  });
});
